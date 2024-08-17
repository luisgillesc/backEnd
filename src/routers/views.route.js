import { Router } from 'express';
import Product from '../clases/products.js';


const router = Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('home', {
      title: 'Lista de Productos',
      products,
    });
  } catch (error) {
    res.status(500).send('Error al cargar la lista de productos');
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('realTimeProducts', {
      title: 'Productos en Tiempo Real',
      products,
    });
  } catch (error) {
    res.status(500).send('Error al cargar los productos en tiempo real');
  }
});

export default router;