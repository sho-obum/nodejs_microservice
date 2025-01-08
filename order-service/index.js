const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 9090;
const mongoose = require("mongoose");
const amqp = require("amqplib");
const Order = require("../order-service/Order");

app.use(express.json());

mongoose
    .connect("mongodb://localhost/order-service")
    .then(() => console.log(`Order-Service DB connected`))
    .catch((err) => console.error(`Order DB connection error: ${err.message}`));

var channel, connection;

// RabbitMQ Connection
async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("Order");
    await channel.assertQueue("PRODUCTS"); // Ensure PRODUCTS queue exists
}

// Order Creation Logic
function createOrder(products, userEmail) {
    let total = 0;
    for (let t = 0; t < products.length; t++) {
        total += products[t].price;
    }
    const newOrder = new Order({
        products,
        user: userEmail,
        total_price: total,
        createdAt: new Date(),
    });
    newOrder.save();
    return newOrder;    
}

// RabbitMQ Consumer
connect()
    .then(() => {
        channel.consume("Order", async (data) => {
            const { products, userEmail } = JSON.parse(data.content.toString());

            console.log("Received order data:", { products, userEmail }); // Log the incoming data to confirm

            if (!products || products.length === 0) {
                console.error("Invalid products data received.");
                channel.ack(data); // Acknowledge even invalid messages
                return;
            }

            const newOrder = createOrder(products, userEmail);
            console.log("Order Created:", newOrder);

            // Acknowledge the message after processing
            channel.ack(data);

            // Now send the order to the PRODUCTS queue
            channel.sendToQueue("PRODUCTS", Buffer.from(JSON.stringify({ newOrder })));

            // Here, you may want to handle PRODUCT queue separately, if needed.
            // This might require setting up another consumer in another part of the system.
        });
    })
    .catch((err) => console.error("Error connecting to RabbitMQ:", err));

// Start the server
app.listen(PORT, () => {
    console.log(`Order-Service running on port ${PORT}`);
});

module.exports = app;
