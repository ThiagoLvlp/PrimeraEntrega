import express from 'express';
import __dirname from '../utils.js'
import mongoose from 'mongoose';

const router = express.Router();

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    availability: Boolean
});

const Product = mongoose.model('Product', productSchema);

router.get('/api/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; // Puedes ajustar el número de productos por página
        const skip = (page - 1) * limit;
        
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .exec();

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading products');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartProducts = await getCartProductsFromAPI(cartId);
        res.render('cart', { cartId, products: cartProducts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading cart');
    }
});



export default router;