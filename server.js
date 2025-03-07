const express = require("express");
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200'
}));

let products = [
    {
        id:'1',
        name: 'producto 1',
        description: 'description 1',
        logo:'logo.png',
        date_release: '2025-01-01',
        date_revision: '2025-01-01',
    }
]

app.get("/bp/products", (req, res) => {
    res.json(products);
});

// 🔹 Verificar si un producto existe por ID
app.get("/bp/products/verification/:id", (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
});

//Create
app.post("/bp/products", (req, res) => {
    const newProduct = req.body; // Obtener datos del body

    if (!newProduct || !newProduct.id || !newProduct.name) {
        return res.status(400).json({ error: "El producto debe tener un ID y un nombre" });
    }

    products.push(newProduct); // Agregar producto al array
    res.status(201).json({ message: "Producto agregado", product: newProduct });
});

// 🔹 Actualizar un producto por ID (PUT)
app.put("/bp/products/:id", (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;

    // Buscar el índice del producto
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Actualizar el producto
    products[index] = { ...products[index], ...updatedProduct };
    res.json({ message: "Producto actualizado", product: products[index] });
});

// 🔹 Eliminar un producto por ID (DELETE)
app.delete("/bp/products/:id", (req, res) => {
    const { id } = req.params;

    // Filtrar para eliminar el producto
    const newProducts = products.filter(p => p.id !== id);
    if (newProducts.length === products.length) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    products = newProducts;
    res.json({ message: "Producto eliminado" });
});

let SERVER_PORT = 3002;
app.listen(SERVER_PORT, () =>
  console.log(`Server is listening on port: ${SERVER_PORT}`)
);
