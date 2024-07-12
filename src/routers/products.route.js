import { Router } from "express";
import Products from '../clases/products.js';
import { __dirname } from '../utils.js';

const products = new Products(`${__dirname}/data/products.json`);

const router = Router();

router.get('/', async(req, res) => {
    const productList = await products.getAllProducts();
    res.status(201).json({data: productList});
});

router.get('/:pid', (req, res) => {
    res.send('Hello World pid');
});

router.post('/', async (req, res) => {
    const newProduct = req.body;
    let{title,price,description,category,thumbnails,status,code,stock} = newProduct;
    const product = await products.addProduct(newProduct);
    res.status(201).json({message: 'Producto creado'});
});

export default router;