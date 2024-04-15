const express = require("express");
const path = require("path");
const { User, Product } = require("./config");
const bcrypt = require('bcrypt');

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

// Home Page Route
app.get("/", (req, res) => {
    res.render("login");
});

// Signup Page Route
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User Route
app.post("/signup", async (req, res) => {
    try {
        const data = {
            name: req.body.username,
            password: req.body.password
        }
        // Check if the username already exists in the database
        const existingUser = await User.findOne({ name: data.name });

        if (existingUser) {
            res.send('User already exists. Please choose a different username.');
        } else {
            // Hash the password using bcrypt
            const saltRounds = 10; // Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            data.password = hashedPassword; // Replace the original password with the hashed one

            await User.create(data);
            res.redirect("/");
        }
    } catch (error) {
        res.status(500).send("Error registering user");
    }
});

// Login User Route
app.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.redirect("/home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});

// Home Page Route after login
app.get("/home", async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();
        res.render("home", { products: products });
    } catch (error) {
        res.status(500).send("Error fetching products from database");
    }
});

// Add Product Route
app.post("/addProduct", async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        }
        // Insert the new product into the database
        await Product.create(data);
        res.redirect("/home");
    } catch (error) {
        res.status(500).send("Error adding product");
    }
});

// Update Product Route
app.post("/updateProduct/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        };
        // Update the product in the database
        await Product.findByIdAndUpdate(productId, updatedData);
        res.redirect("/home");
    } catch (error) {
        res.status(500).send("Error updating product");
    }
});

// Delete Product Route
app.post("/deleteProduct/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        // Delete the product from the database
        await Product.findByIdAndDelete(productId);
        res.redirect("/home");
    } catch (error) {
        res.status(500).send("Error deleting product");
    }
});

// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
