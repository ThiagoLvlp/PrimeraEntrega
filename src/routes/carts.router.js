import { Router } from "express";
import fs from "fs";
const rutaArchivo = "../files/Cart.json";

const router = Router();

// Leer Archivo JSON del carrito //////
const leerArchivoJSON = (ruta) => {
    try {
    const data = fs.readFileSync(ruta, "utf8");
    return JSON.parse(data);
} catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    return [];
}
};
const saveCartToFile = (cart) => {
    fs.writeFileSync(rutaArchivo, JSON.stringify(cart, null, 2), "utf8");
};

//////-------- Crear Neuvo Cart ------//////// 
router.post("/", (req, res) => {
    const newCart = {
    id: generateNewCartId(),
    products: [],
};
    const carts = leerArchivoJSON(rutaArchivo);
    carts.push(newCart);
    saveCartToFile(carts);
    res.status(201).json(newCart);
});

///------- Buscar Cart Por Id -----//////// 
router.get("/:cid", (req, res) => {
    const cartId = Number(req.params.cid);
    const carts = leerArchivoJSON(rutaArchivo);
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
}
    res.send(cart.products);
});


/////-------- Agregar Producto al Cart mediante Id del producto ---///////////////
router.post("/:cid/product/:pid", (req, res) => {
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);
    const quantity = req.body.quantity || 1; // Default quantity is 1
    const carts = leerArchivoJSON(rutaArchivo);
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
}
    const existingProduct = cart.products.find((product) => product.product === productId);
    if (existingProduct) {
    existingProduct.quantity += quantity;
} else {
    cart.products.push({ product: productId, quantity });
}
    saveCartToFile(carts);
    res.status(201).json(cart);
});

//// ----------- Generar Id ------------- ////
function generateNewCartId() {
    const carts = leerArchivoJSON(rutaArchivo);
    const existingIds = carts.map((cart) => cart.id);
    const newId = Math.max(...existingIds, 0) + 1;
    return newId;
}

export default router;