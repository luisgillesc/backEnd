import express from 'express';
import routerProducts from './routers/products.route.js';
import routerCarts from './routers/carts.route.js';
import { __dirname } from './utils.js';
import Products from './clases/products.js';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { createServer } from 'http';
import path from 'path';


const app = express();
const port=8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products',routerProducts);
app.use('/api/carts',routerCarts);

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', '../src/view');

// Conexión a MongoDB
mongoose.connect('mongodb+srv://luisgillesc:1qaz2wsx3edc@coderback.wvpmo5m.mongodb.net/?retryWrites=true&w=majority&appName=CoderBack', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

export const io = new Server(httpServer);

// Configurar Socket.IO
io.on('connection', (socket) => {
    console.log('New client connected');
  
    socket.on('newProduct', async (productData) => {
      const newProduct = new Product(productData);
      await newProduct.save();
      const products = await Product.find().lean();
      io.emit('updateProductList', products);
    });
  
    socket.on('deleteProduct', async (productId) => {
      await Product.findByIdAndDelete(productId);
      const products = await Product.find().lean();
      io.emit('updateProductList', products);
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

const products = new Products(`${__dirname}/data/products.json`);

app.listen(port, () => {
    console.log("Servidor corriendo en el puerto",port);
});