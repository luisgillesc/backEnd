import { Router } from "express";
import Products from '../clases/products.js';
import { __dirname } from '../utils.js';

const products = new Products(`${__dirname}/data/products.json`);

const router = Router();

function generarIdAutogenerado() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // Construir filtros de búsqueda
        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { category: query },
                    { status: query === 'true' || query === 'false' ? query : '' },
                ],
            };
        }

        // Construir opciones de paginación y ordenamiento
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
            lean: true,
        };

        // Realizar la búsqueda con paginación y filtros
        const products = await Product.paginate(filter, options);

        // Crear el objeto de respuesta
        const response = {
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage
                ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
                : null,
            nextLink: products.hasNextPage
                ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
                : null,
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
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