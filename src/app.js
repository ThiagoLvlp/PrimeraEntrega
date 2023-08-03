import express from 'express';
import productsRoutes from './routes/products.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import cartsRoutes from './routes/carts.router.js'
import viewRouter from './routes/view.router.js'
import { Server } from 'socket.io';

const app = express();
const PORT = 8080;

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views/');
app.set('view engine', 'handlebars');

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

const httpServer = app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
})

app.use('/', viewRouter);

const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
    console.log("Nuevo usuario conectado");

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { productos: Products });
});

app.post('/addproduct', (req, res) => {
const newProduct = req.body;
io.emit('productos', Products);
res.redirect('/realtimeproducts');
});

io.on('connection', (socket) => {
console.log('Usuario conectado');

socket.emit('productos', Products);
})});