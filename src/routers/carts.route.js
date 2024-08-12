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

// Lista todos los productos en el carrito
router.get('/:cid', async (req, res) => {
  try {
    const cartPath = path.join(cartsDirectory, `${req.params.cid}.json`);
    const cart = new Cart(cartPath);
    const items = await cart.getAllItemsInCart();
    res.json(items);
  } catch (error) {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// POST /api/carts/:cid/product/:pid
// Agrega un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartPath = path.join(cartsDirectory, `${req.params.cid}.json`);
    const cart = new Cart(cartPath);
    const newItem = { product: req.params.pid, quantity: 1 };

    const items = await cart.getAllItemsInCart();
    const itemIndex = items.findIndex(item => item.product === req.params.pid);

    if (itemIndex !== -1) {
      // Incrementar la cantidad si el producto ya existe
      items[itemIndex].quantity += 1;
      await cart.updateCartItem(req.params.pid, items[itemIndex]);
    } else {
      // Agregar un nuevo producto si no existe
      await cart.addItemToCart(newItem);
    }

    res.json(await cart.getAllItemsInCart());
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
});
export default router;