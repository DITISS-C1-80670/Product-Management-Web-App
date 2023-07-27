const productForm = document.getElementById('productForm');
const productList = document.querySelector('.product-list');

// Function to display products in the list
function displayProducts(products) {
  productList.innerHTML = '';
  products.forEach((product) => {
    const productItem = document.createElement('div');
    productItem.classList.add('product-item');
    productItem.innerHTML = `
      <span>${product.name} - $${product.price}</span>
      <button onclick="updateProduct('${product._id}', '${product.name}', '${product.description}', ${product.price})">Update</button>
      <button onclick="deleteProduct('${product._id}')">Delete</button>
    `;
    productList.appendChild(productItem);
  });
}

// Function to fetch and display all products
async function getProducts() {
  try {
    const response = await fetch('/products');
    const products = await response.json();
    displayProducts(products);
  } catch (err) {
    console.error('Error fetching products:', err);
  }
}

// Function to create a new product
async function createProduct(event) {
  event.preventDefault();
  const formData = new FormData(productForm);
  const productData = Object.fromEntries(formData.entries());
  try {
    const response = await fetch('/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    const newProduct = await response.json();
    getProducts();
    productForm.reset();
  } catch (err) {
    console.error('Error creating product:', err);
  }
}

// Function to update a product by ID
async function updateProduct(productId, name, description, price) {
  const updatedName = prompt('Enter the updated product name:', name);
  const updatedDescription = prompt('Enter the updated product description:', description);
  const updatedPrice = parseFloat(prompt('Enter the updated product price:', price));

  if (updatedName && updatedPrice) {
    try {
      const updatedProduct = {
        name: updatedName,
        description: updatedDescription,
        price: updatedPrice,
      };

      const response = await fetch(`/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      const result = await response.json();
      console.log(result);
      getProducts();
    } catch (err) {
      console.error('Error updating product:', err);
    }
  }
}

// Function to delete a product by ID
async function deleteProduct(productId) {
  try {
    const response = await fetch(`/products/${productId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    console.log(result);
    getProducts();
  } catch (err) {
    console.error('Error deleting product:', err);
  }
}

// Add event listener to the form submission
productForm.addEventListener('submit', createProduct);

// Fetch and display all products on page load
getProducts();
