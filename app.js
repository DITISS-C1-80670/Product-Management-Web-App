const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/product_db'; 

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

app.use(bodyParser.json());

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Create a new product
app.post('/products', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Validate if required fields are provided
    if (!name || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    // Create a new product object
    const newProduct = new Product({
      name,
      description,
      price,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create a product' });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a single product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch the product' });
  }
});

// Update a product by ID
app.put('/products/:id', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Validate if required fields are provided
    if (!name || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update the product' });
  }
});

// Delete a product by ID
app.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndRemove(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete the product' });
  }
});

// Serve the index.html file for the root route '/'
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
