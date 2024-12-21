import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos con filtros, paginación y ordenamiento
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de productos a devolver
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página de productos a devolver
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordenamiento ascendente o descendente por precio
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Filtro por categoría o disponibilidad
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *       500:
 *         description: Error al obtener los productos
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query ? { category: query } : {};
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
    };

    const result = await Product.paginate(filter, options);

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a obtener
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               code:
 *                 type: string
 *                 description: Código único del producto
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *               stock:
 *                 type: number
 *                 description: Cantidad en stock
 *               category:
 *                 type: string
 *                 description: Categoría del producto
 *               thumbnails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Rutas de las imágenes del producto
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error en la validación de datos
 */
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Actualiza un producto existente
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               code:
 *                 type: string
 *                 description: Código único del producto
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *               stock:
 *                 type: number
 *                 description: Cantidad en stock
 *               category:
 *                 type: string
 *                 description: Categoría del producto
 *               thumbnails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Rutas de las imágenes del producto
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       400:
 *         description: Error en la validación de datos
 */
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Elimina un producto por ID
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:pid', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.pid);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
