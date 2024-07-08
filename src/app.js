import express from 'express';
import routerProducts from './routers/products.router.js';
import routerCarts from './routers/carts.router.js';
import { __dirname } from './utils.js';
import Products from './clases/products.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products',routerProducts);
app.use('/api/carts',routerCarts);

const products = new Products(`${__dirname}/data/products.json`);

app.post('/', async (req, res) => {
    const newProduct = req.body;
    const product = await products.addProduct(newProduct);
    res.send(product);
});
    


app.listen(8080, () => {
    console.log('Servidor corriendo en el puerto 8080');
});