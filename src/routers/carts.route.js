import { Router } from "express";
import Cart from "../clases/carts.js";
import { __dirname } from '../utils.js';

const cartPath = new Cart(`${__dirname}/data`);

const router = Router();


// POST /api/carts/
// Crea un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const { id, cart } = await Cart.createCart(cartPath);
    res.status(201).json({ id, cart });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cart' });
  }
});

export default router;