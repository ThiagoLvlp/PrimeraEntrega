import express from 'express';
import productsRoutes from './routes/products.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import cartsRoutes from './routes/carts.router.js'
import viewRouter from './routes/view.router.js'
import mongoose from 'mongoose';

const app = express();

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views/');
app.set('view engine', 'handlebars');

app.use('/', viewRouter)
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

const SERVER_PORT = 8080;
app.listen(8080, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

const connectMongoDB = async ()=>{
    try {
        await mongoose.connect('mongodb+srv://thiagolopezvega:080897t@cluster0.xxpl1e8.mongodb.net/?retryWrites=true&w=majority');
        console.log("Conectado con exito a MongoDB usando Moongose.")

    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};
connectMongoDB();
