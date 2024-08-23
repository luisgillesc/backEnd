import { Router } from "express";
import Cart from "../clases/carts.js";
import { __dirname } from '../utils.js';

const cartPath = new Cart(`${__dirname}/data`);

const router = Router();

// DELETE /api/carts/:cid/products/:pid - Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const cart = await Cart.findById(cid);

      cart.products = cart.products.filter(product => product.product.toString() !== pid);
      await cart.save();

      res.json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
  }
});

// PUT /api/carts/:cid - Actualizar el carrito con un nuevo arreglo de productos
router.put('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const { products } = req.body;

      const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });

      res.json({ status: 'success', message: 'Carrito actualizado', cart });
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al actualizar el carrito' });
  }
});

// PUT /api/carts/:cid/products/:pid - Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findById(cid);
      const productIndex = cart.products.findIndex(product => product.product.toString() === pid);

      if (productIndex !== -1) {
          cart.products[productIndex].quantity = quantity;
          await cart.save();
          res.json({ status: 'success', message: 'Cantidad de producto actualizada', cart });
      } else {
          res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
      }
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al actualizar la cantidad del producto' });
  }
});

// DELETE /api/carts/:cid - Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });

      res.json({ status: 'success', message: 'Todos los productos eliminados del carrito', cart });
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al eliminar todos los productos del carrito' });
  }
});

// GET /api/carts/:cid - Traer todos los productos completos del carrito
router.get('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const cart = await Cart.findById(cid).populate('products.product');

      res.json({ status: 'success', cart });
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
  }
});
export default router;