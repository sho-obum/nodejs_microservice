const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 8081;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const amqp = require("amqplib");
const Product = require("./Product");
const isAuthenticated = require("../isAuthenticated");

app.use(express.json());

mongoose
    .connect("mongodb://localhost/product-service")
    .then(() => console.log(`Product-Service DB connected`))
    .catch((err) => console.error(`DB connection error: ${err.message}`));

var channel, connection;

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer); // Correct method for amqplib
    channel = await connection.createChannel();
    await channel.assertQueue("PRODUCTS");
}

connect().catch((err) => console.error("Error connecting to RabbitMQ:", err));

// Create a new product
app.post("/product/create", isAuthenticated, async (req, res) => {
    const { name, description, price } = req.body;
    const newProduct = new Product({
        name,
        description,
        price,
    });
    newProduct.save();
    return res.json(newProduct);
});

app.post("/product/buy", isAuthenticated, async (req, res) => {
    const { ids } = req.body;
    const products = await Product.find({ _id: { $in: ids } }); // Find product by ID

    if (!products || products.length === 0) {
        return res.status(404).json({ message: "Products not found" });
    }

    channel.sendToQueue("Order", Buffer.from(
        JSON.stringify({
            products, // Use 'products' instead of 'product' for consistency
            userEmail: req.user.email,
        })
    ));

    return res.status(200).json({ message: "Order placed", products });
});

app.listen(PORT, () => {
    console.log(`Product-Service running on port ${PORT}`);
});

// Add this line to export the app
module.exports = app;
