// config.js

const mongoose = require('mongoose');

// Change the database name to "Login"
const connect = mongoose.connect("mongodb://localhost:27017/Login");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Create Schema for Users
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create Schema for Products
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

// Change the collection name to "users"
const User = mongoose.model("users", userSchema);

// Change the collection name to "products"
const Product = mongoose.model("products", productSchema);

module.exports = { User, Product };
