import { Router } from "express";
const rutaArchivo = "../files/Products.json";
import fs from "fs";
const router = Router();

//Leer Archivo JSON de los productos //////
const leerArchivoJSON = (ruta) => {
    try {
        const data = fs.readFileSync(ruta, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer el archivo JSON:", error);
        return [];
    }
};
const Products = leerArchivoJSON(rutaArchivo);
/////--------------------- * --------------------////////

/////--------------------- Get Products --------------------////////

router.get("/", (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    if (limit && !isNaN(limit)) {
    const limitedProducts = Products.slice(0, limit);
    res.send(limitedProducts);
} else {
    res.send(Products);
    }
});

/////--------------------- GetProductById --------------------////////
router.get('/:idProducts', (req, res) => {
    const idProducts = Number(req.params.idProducts);
    const product = Products.find((product) => product.id === idProducts);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.send(product);
});

/////--------------------- Create Product--------------------////////
router.post("/", (req, res) => {
    const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status = true,
} = req.body;
    const existingIds = Products.map((product) => product.id);
    const newId = Math.max(...existingIds, 0) + 1;
    const newProduct = {
        id: newId,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    };
    Products.push(newProduct);
    fs.writeFileSync(rutaArchivo, JSON.stringify(Products, null, 2), "utf8");
    res.status(201).json(newProduct);
});

/////--------------------- Update Product --------------------////////
router.put('/:idProducts', (req, res) => {
    const idProducts = Number(req.params.idProducts);
    const productIndex = Products.findIndex((product) => product.id === idProducts);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const existingProduct = Products[productIndex];
    const {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails,
        status,
    } = req.body;

    existingProduct.title = title || existingProduct.title;
    existingProduct.description = description || existingProduct.description;
    existingProduct.code = code || existingProduct.code;
    existingProduct.price = price || existingProduct.price;
    existingProduct.stock = stock || existingProduct.stock;
    existingProduct.category = category || existingProduct.category;
    existingProduct.thumbnails = thumbnails || existingProduct.thumbnails;
    existingProduct.status = status !== undefined ? status : existingProduct.status;
    
    Products[productIndex] = existingProduct;
    fs.writeFileSync(rutaArchivo, JSON.stringify(Products, null, 2), 'utf8');
    res.json(existingProduct);
});

/////--------------------- Delate Product--------------------////////
router.delete('/:idProducts', (req, res) => {
    const idProducts = Number(req.params.idProducts);
    const productIndex = Products.findIndex((product) => product.id === idProducts);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const deletedProduct = Products.splice(productIndex, 1);
    fs.writeFileSync(rutaArchivo, JSON.stringify(Products, null, 2), 'utf8');
    res.json({ message: 'Product deleted successfully', deletedProduct });
});





export default router;
