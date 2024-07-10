import express from 'express';
import routerProducts from './routers/products.route.js';
import routerCarts from './routers/carts.route.js';
import { __dirname } from './utils.js';
import Products from './clases/products.js';


const app = express();
const port=8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products',routerProducts);
app.use('/api/carts',routerCarts);

const products = new Products(`${__dirname}/data/products.json`);

app.post('/', async (req, res) => {
    const newProduct = req.body;
    let{title,price,description,category,thumbnails,status,code,stock} = newProduct;
    const product = await products.addProduct(newProduct);
    res.send(product);
});
    


app.listen(port, () => {
    console.log("Servidor corriendo en el puerto",port);
});