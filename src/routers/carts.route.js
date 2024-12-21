import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crea un nuevo carrito
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 *       500:
 *         description: Error en la creación del carrito
 */
router.post('/', async (req, res) => {
  try {
    const newCart = new Cart();
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtiene los productos de un carrito por ID
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Productos del carrito obtenidos
 *       404:
 *         description: Carrito no encontrado
 */
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   post:
 *     summary: Agrega un producto al carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto agregado al carrito
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const product = await Product.findById(req.params.pid);

    if (!cart || !product) {
      return res.status(404).json({ message: 'Carrito o producto no encontrado' });
    }

    const productIndex = cart.products.findIndex((p) => p.product.equals(req.params.pid));

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Elimina un producto del carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.products = cart.products.filter((p) => !p.product.equals(req.params.pid));
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualiza los productos de un carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       200:
 *         description: Carrito actualizado
 *       404:
 *         description: Carrito no encontrado
 */
router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body;

    const cart = await Cart.findById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.products = products;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   put:
 *     summary: Actualiza la cantidad de un producto en el carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex((p) => p.product.equals(req.params.pid));

    if (productIndex >= 0) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Elimina todos los productos de un carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito vacío
 *       404:
 *         description: Carrito no encontrado
 */
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.products = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
