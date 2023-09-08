import express from 'express';
import Product from '../models/productsmodel.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const query = req.query.query || '';
        const category = req.query.category || '';
        const availability = req.query.availability || '';
        const skip = (page - 1) * limit;
        const regexQuery = new RegExp(query, 'i');
        const regexCategory = new RegExp(category, 'i');
        const regexAvailability = new RegExp(availability, 'i');
        const sortOptions = {};
        if (sort === 1 || sort === -1) {
            sortOptions.price = sort;
        }
        const filter = {
            $or: [{ title: regexQuery }, { description: regexQuery }],
            category: regexCategory,
            availability: regexAvailability
        };
        const totalCount = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        const products = await Product.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const response = {
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/api/products?page=${prevPage}` : null,
            nextLink: hasNextPage ? `/api/products?page=${nextPage}` : null
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error retrieving products' });
    }
});


router.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); 
        res.render('products', { products }); 
    } catch (error) {
        console.error('Error al recuperar los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});


//Crear un nuevo producto
router.post("/", async (req, res) => {
    try {
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

        const newProduct = new Product({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
            status,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product' });
    }
});


// PUT: Actualizar un producto existente
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

// DELETE: Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// GET: Buscar un producto por ID
router.get("/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving product by ID' });
    }
});

export default router;
