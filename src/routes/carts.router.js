import express from 'express';
import Cart from '../models/cartsmodel.js';
import Product from '../models/productsmodel.js';

const router = express.Router();

//Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const { products } = req.body;
        const newCart = new Cart({ products });
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating cart' });
    }
});

//Obtener productos de un carrito por su ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart.products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving cart products' });
    }
});

// Agregar producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const quantity = req.body.quantity || 1;
        cart.products.push({ product: product._id, quantity });
        const savedCart = await cart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product to cart' });
    }
});


// Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = cart.products.filter(product => product.product.toString() !== req.params.pid);
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product from cart' });
    }
});

//Actualizar carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = req.body.products;
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating cart' });
    }
});

//Actualizar cantidad de ejemplares de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productToUpdate = cart.products.find(product => product.product.toString() === req.params.pid);
        if (!productToUpdate) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        productToUpdate.quantity = req.body.quantity || 1;
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product quantity in cart' });
    }
});

//Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = [];
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting all products from cart' });
    }
});

export default router;
