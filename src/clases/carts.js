import fs from 'node:fs'

class Cart {
  constructor(path) {
    this.path = path;
    this.cartItems = [];
  }

  static async createCart(cartPath) {
    const path = `${cartPath}/cart.json`;
    
    const newCart = new Cart(path);
    await fs.writeFile(path, JSON.stringify({ items: newCart.cartItems }));
    
    return { id: newCart.id, cart: newCart };
  }

  async addItemToCart(newItem) {
    await this.getAllItemsInCart();
    this.cartItems.push(newItem);
    await fs.writeFile(this.path, JSON.stringify({ items: this.cartItems }));
  }

  async updateCartItem(itemId, updatedItem) {
    await this.getAllItemsInCart();
    const itemIndex = this.cartItems.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      this.cartItems[itemIndex] = {
        ...this.cartItems[itemIndex],
        ...updatedItem,
      };
      await fs.writeFile(this.path, JSON.stringify({ items: this.cartItems }));
      return true;
    }
    return false;
  }

  async removeItemFromCart(itemId) {
    await this.getAllItemsInCart();
    const itemIndex = this.cartItems.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      this.cartItems.splice(itemIndex, 1);
      await fs.writeFile(this.path, JSON.stringify({ items: this.cartItems }));
      return true;
    }
    return false;
  }

  async getAllItemsInCart() {
    const allItems = await fs.readFile(this.path, "utf-8");
    this.cartItems = JSON.parse(allItems).items;
    this.id = JSON.parse(allItems).id;
    return this.cartItems;
  }
}

export default Cart;