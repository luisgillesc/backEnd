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
        
    }

    async deleteProduct(productId) {
        
    }

    async getAllProducts() {
        const allProducts= await fs.promises.readFile(this.path, 'utf-8');
        this.productList = [...JSON.parse(allProducts).data];
        return this.productList;
    }
}
export default Products;
