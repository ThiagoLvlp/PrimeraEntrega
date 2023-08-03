import express from 'express';
const router = express.Router();
import path from 'path';
import fs from 'fs';
import __dirname from '../utils.js'


const rutaArchivo = path.join(__dirname, '..', 'files', 'Products.json');
const leerArchivoJSON = (ruta) => {
    try {
    const data = fs.readFileSync(ruta, 'utf8');
    return JSON.parse(data);
} catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    return [];
}
};

const guardarArchivoJSON = (ruta, data) => {
    try {
fs.writeFileSync(ruta, JSON.stringify(data, null, 2), 'utf8');
console.log('Archivo JSON actualizado correctamente.');
} catch (error) {
    console.error('Error al guardar el archivo JSON:', error);
    }
};

const Products = leerArchivoJSON(rutaArchivo);
router.get('/', (req, res) => {
    res.render('home', { Productos: Products });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { productos: Products });
});

router.post('/addproduct', (req, res) => {
const newProduct = req.body;

const newProductId = Products.length + 1;
newProduct.id = newProductId;
Products.push(newProduct);
guardarArchivoJSON(rutaArchivo, Products);
res.redirect('/realtimeproducts');
});


export default router;