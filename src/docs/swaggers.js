import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
    openapi: '3.0.3',
    info: {
        title: 'Adoptme API – Users',
        version: '1.0.0',
        description:
        'Documentación de endpoints del módulo **Users** para el proyecto Adoptme (Coderhouse Backend III).',
    },
    servers: [
        { url: 'http://localhost:8080', description: 'Local' }
    ],
    tags: [
        { name: 'Users', description: 'Operaciones sobre usuarios' }
    ],
    },
    apis: ['src/docs/**/*.yaml'],
};

const swaggerSpecs = swaggerJSDoc(options);
export default swaggerSpecs;
