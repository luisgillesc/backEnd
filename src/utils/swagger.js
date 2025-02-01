import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Productos y Carritos',
      version: '1.0.0',
      description: 'Documentación de la API para gestionar productos y carritos.',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: ['./src/routers/*.route.js'], // Ajusta la ruta para incluir los archivos .route.js
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;