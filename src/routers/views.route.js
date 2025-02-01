import { Router } from 'express';
import Product from '../models/Product.js';


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

router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 5, sort, query } = req.query;

    const filter = query ? { category: query } : {};
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
      lean: true, // Para que Handlebars pueda leer los datos
    };

    const result = await Product.paginate(filter, options);

    res.render('index', {
      title: 'Lista de Productos',
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}` : null,
    });
  } catch (error) {
    res.status(500).send('Error al cargar los productos');
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    res.render('productDetails', {
      title: product.title,
      product,
    });
  } catch (error) {
    res.status(500).send('Error al cargar el producto');
  }
});

export default router;