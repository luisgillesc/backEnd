import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routers/products.route.js';
import cartRouter from './routers/carts.route.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger.js';
import { engine } from 'express-handlebars'; // Importar Handlebars
import path from 'path';
import { fileURLToPath } from 'url';
import viewsRouter from './routers/views.route.js';

// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Configuración de Handlebars
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'), // ✔ Ruta correcta
    partialsDir: path.join(__dirname, '/views/partials'), // ✔ Ruta correcta
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views')); 



// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.use('/', viewsRouter);



// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
