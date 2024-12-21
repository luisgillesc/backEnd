import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routers/products.route.js';
import cartRouter from './routers/carts.route.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger.js';

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
