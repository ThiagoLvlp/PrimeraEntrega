import express from 'express';
import productsRoutes from './routes/products.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import cartsRoutes from './routes/carts.router.js'
import viewRouter from './routes/view.router.js'
import { Server } from 'socket.io';
import fs from "fs";

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

app.get('/', (req, res) => {
fs.readFile('./files/Products.json', 'utf8', (err, data) => {
    if (err) {
    console.error('Error al leer el archivo de productos:', err);
    res.status(500).send('Error al leer los datos de productos.');
    return;
}
    const productos = JSON.parse(data);
    res.render('home', { productos: productos });
});
});

})