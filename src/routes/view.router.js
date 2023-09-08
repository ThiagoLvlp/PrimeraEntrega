import express from 'express';
import __dirname from '../utils.js'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import productsSchema from '../models/productsmodel.js';

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
        const limit = 21; // Ajustar el número de productos por página
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

router.use(cookieParser("CoderS3cr3tC0d3"));

router.get('/',(req,res)=>{
    res.render('login',{})
});

router.get("/products", async (req, res) => {
    try {
        const products = await productsSchema.find();
        res.render('products', {
            user: req.session.user,
            products: products
        });
    } catch (error) {
        console.error("Error al obtener productos: " + error);
        res.status(500).send("Error al obtener productos");
    }
});

export default router;