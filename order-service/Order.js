const mongoose = require('mongoose');
const product = require('../product-service/Product');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
product:[
    {
        product_id:  String ,

    }
],
user_id: String,
total_price: Number,
created_at:{
    type:Date,
    default:Date.now(),
}

});
module.exports = Order = mongoose.model("order", OrderSchema);
