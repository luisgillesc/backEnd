import { Router } from "express";
import Cart from "../clases/carts.js";
import { __dirname } from '../utils.js';

const cartPath = new Cart(`${__dirname}/data`);

const router = Router();

// Ruta raíz POST / para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const { id, cart } = await Cart.createCart(cartPath);
    res.json({ id, products: cart.cartItems });
  } catch (error) {
    res.status(500).json({ message: "Error al crear un nuevo carrito" });
  }
});

// Ruta GET /:cid para listar los productos de un carrito específico
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = carts.find((cart) => cart.id === cartId);

  if (!cart) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  res.json(cart.products);
});

// Ruta POST /:cid/product/:pid para agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = carts.find((cart) => cart.id === cartId);

  if (!cart) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  const existingProduct = cart.products.find((product) => product.product === productId);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({ product: productId, quantity: 1 });
  }

  res.json(cart.products);
});

export default router;