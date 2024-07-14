import fs from 'node:fs'

class Products {
    constructor(path) {
        this.path = path;
        this.productList = [];
    }

    async addProduct(newProduct) {
        await this.getAllProducts();
        this.productList.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify({data: this.productList}));
    }

    async updateProduct(productId, updatedProduct) {
        await this.getAllProducts();
        const productIndex = this.productList.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            this.productList[productIndex] = { ...this.productList[productIndex], ...updatedProduct };
            await fs.promises.writeFile(this.path, JSON.stringify({data: this.productList}));
            return true;
        }
        return false;
    }

    async deleteProduct(productId) {
        await this.getAllProducts();
        const productIndex = this.productList.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            this.productList.splice(productIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify({data: this.productList}));
            return true;
        }
        return false;
    }

    async getAllProducts() {
        const allProducts= await fs.promises.readFile(this.path, 'utf-8');
        this.productList = [...JSON.parse(allProducts).data];
        return this.productList;
    }
}
export default Products;
