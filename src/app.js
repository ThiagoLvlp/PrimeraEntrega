import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';

//Routes
import cartsRoutes from './routes/carts.router.js';
import productsRoutes from './routes/products.router.js';

//Views
import viewRouter from './routes/view.router.js';
import usersViewRouter from './routes/users.views.router.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views/');
app.set('view engine', 'handlebars');

const SERVER_PORT = 8080;
app.listen(8080, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

const MONGO_URL= "mongodb+srv://thiagolopezvega:080897t@cluster0.xxpl1e8.mongodb.net/"

app.use(session({
    store:MongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        collectionName: "sessions",
        ttl: 1000
    }),
    secret: "coderS3cr3t",
    resave: false,
    saveUninitialized: true, 
}));

app.post('/api/sessions/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            res.status(500).send('Error interno del servidor');
        } else {
            res.redirect('/');
        }
    });
});

//Routes 

app.use('/', viewRouter)
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);

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
