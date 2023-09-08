import { Router } from 'express';
import userModel from '../models/user.model.js';

const router = Router();


router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    console.log("Registrando user");
    console.log(req.body);

    const exists = await userModel.findOne({ email })
    if (exists) {
        return res.status(400).send({ status: 'error', message: 'usuario ya existe' })
    }
    const user = {
        first_name,
        last_name,
        email,
        age,
        password 
    }
    const result = await userModel.create(user);
    res.send({ status: "success", message: "Usuario creado con exito con ID: " + result.id })
});


const adminemail = 'adminCoder@coder.com';
const adminpass = 'adminCod3r123';

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email === adminemail && password === adminpass) {
            const user = {
                first_name: "Admin",
                last_name: "Admin",
                email: adminemail,
                age: 0, 
                role: 'admin'
            };
            req.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: user.role,
            };
            return res.send({ status: "success", payload: req.session.user, message: "¡Inicio de sesión exitoso como administrador! :)" });
        }
        const user = await userModel.findOne({ email, password });
        if (!user) {
            return res.status(401).send({ status: "error", error: "Credenciales incorrectas" });
        }
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
        };
        res.send({ status: "success", payload: req.session.user, message: "¡Inicio de sesión exitoso! :)" });
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

export default router;