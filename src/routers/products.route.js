import { Router } from "express";
import Products from '../clases/products.js';
import { __dirname } from '../utils.js';

const products = new Products(`${__dirname}/data/products.json`);

const router = Router();

function generarIdAutogenerado() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

router.get('/', async(req, res) => {
    const productList = await products.getAllProducts();
    res.status(201).json({data: productList});
});

router.get('/:pid', async (req, res) => {
    try {
      const pid = req.params.pid;
      const product = await products.findById(pid);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

router.post('/', async (req, res) => {
    const newProduct = req.body;
    const id = generarIdAutogenerado();
    newProduct.id = id;
    let{title,price,description,category,thumbnails,status,code,stock} = newProduct;
    const product = await products.addProduct(newProduct);
    res.status(201).json({message: 'Producto creado'});
});

router.put('/:pid', async(req, res) => {
    const pid = req.params.pid;
    const updatedProduct = req.body;
    
    const product = await products.updateProduct(pid, updatedProduct);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Producto actualizado' });
});

router.delete('/:pid', async(req, res) => {
    const pid = req.params.pid;
    
    const deletedProduct = await products.deleteProduct(pid);
    
    if (!deletedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.status(200).json({ message: 'Producto eliminado' });
});

export default router;