import express from 'express';
import productsRoutes from './routes/products.router.js'
import cartsRoutes from './routes/carts.router.js'

const app = express();
const PORT = 8080;

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);



app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
})
