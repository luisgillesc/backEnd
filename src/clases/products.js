import fs from 'node:fs'

class Products {
    constructor(path) {
        this.path = path;
        this.productList = [];
    }

    async addProduct(newProduct) {
        await fs.promises.writeFile(this.path, JSON.stringify({data:[]}))
    }

    async updateProduct(productId, updatedProduct) {
        
    }

    async deleteProduct(productId) {
        
    }

    async getAllProducts() {
        
    }
}
export default Products;
