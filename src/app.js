import express from 'express';
import routerProducts from './routers/products.router.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products',routerProducts);




app.listen(8080, () => {
    console.log('Servidor corriendo en el puerto 8080');
});