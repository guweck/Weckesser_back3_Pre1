// src/docs/swaggers.js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Adoptme API – Users & Sessions',
            version: '1.0.0',
            description:
                'Documentación de endpoints para el proyecto Adoptme (Coderhouse Backend III).\n\nIncluye Users (GET, GET by id, PUT, DELETE), Sessions (POST register/login) y Adoptions (POST).',
        },
        servers: [
            { url: 'http://localhost:8080', description: 'Local' },
        ],
        tags: [
            { name: 'Users', description: 'Operaciones sobre usuarios' },
            { name: 'Sessions', description: 'Autenticación / Registro' },
            { name: 'Adoptions', description: 'Adopciones de mascotas' },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '66c6d2932e8c739f18eea62a' },
                        first_name: { type: 'string', example: 'Lazaro' },
                        last_name: { type: 'string', example: 'Carroll' },
                        email: { type: 'string', example: 'lazaro.carroll7@gmail.com' },
                        role: { type: 'string', example: 'user' },
                        pets: {
                            type: 'array',
                            items: { type: 'string' },
                            example: [],
                        },
                    },
                },
                UserUpdateInput: {
                    type: 'object',
                    properties: {
                        first_name: { type: 'string', example: 'Ada' },
                        last_name: { type: 'string', example: 'Lovelace' },
                        role: { type: 'string', example: 'admin' },
                    },
                },
                SessionRegisterInput: {
                    type: 'object',
                    required: ['first_name', 'last_name', 'email', 'password'],
                    properties: {
                        first_name: { type: 'string', example: 'Test' },
                        last_name: { type: 'string', example: 'User' },
                        email: { type: 'string', example: 'test@example.com' },
                        password: { type: 'string', example: 'coder123' },
                    },
                },
                SessionLoginInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'test@example.com' },
                        password: { type: 'string', example: 'coder123' },
                    },
                },
            },
            responses: {
                NotFound: {
                    description: 'Recurso no encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'error' },
                                    error: { type: 'string', example: 'Not found' },
                                },
                            },
                        },
                    },
                },
                ValidationError: {
                    description: 'Error de validación / datos inválidos',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'error' },
                                    error: { type: 'string', example: 'Invalid input' },
                                },
                            },
                        },
                    },
                },
                Success: {
                    description: 'Operación exitosa',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'success' },
                                    payload: { type: 'object' },
                                },
                            },
                        },
                    },
                },
                Created: {
                    description: 'Recurso creado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'success' },
                                    payload: { $ref: '#/components/schemas/User' },
                                },
                            },
                        },
                    },
                },
            },
            parameters: {
                UidParam: {
                    name: 'uid',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID de usuario',
                },
                AidParam: {
                    name: 'aid',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID de adopción',
                },
                PidParam: {
                    name: 'pid',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID de mascota (pet)',
                },
            },
        },
        paths: {
            // ---------- USERS ----------
            '/api/users': {
                get: {
                    tags: ['Users'],
                    summary: 'Listar usuarios',
                    responses: {
                        200: {
                            $ref: '#/components/responses/Success',
                        },
                    },
                },
            },
            '/api/users/{uid}': {
                get: {
                    tags: ['Users'],
                    summary: 'Obtener usuario por ID',
                    parameters: [{ $ref: '#/components/parameters/UidParam' }],
                    responses: {
                        200: { $ref: '#/components/responses/Success' },
                        404: { $ref: '#/components/responses/NotFound' },
                    },
                },
                put: {
                    tags: ['Users'],
                    summary: 'Actualizar usuario por ID',
                    parameters: [{ $ref: '#/components/parameters/UidParam' }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UserUpdateInput' },
                            },
                        },
                    },
                    responses: {
                        200: { $ref: '#/components/responses/Success' },
                        400: { $ref: '#/components/responses/ValidationError' },
                        404: { $ref: '#/components/responses/NotFound' },
                    },
                },
                delete: {
                    tags: ['Users'],
                    summary: 'Eliminar usuario por ID',
                    parameters: [{ $ref: '#/components/parameters/UidParam' }],
                    responses: {
                        200: { $ref: '#/components/responses/Success' },
                        404: { $ref: '#/components/responses/NotFound' },
                    },
                },
            },

            // ---------- SESSIONS (POST requerido) ----------
            '/api/sessions/register': {
                post: {
                    tags: ['Sessions'],
                    summary: 'Registrar usuario',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SessionRegisterInput' },
                            },
                        },
                    },
                    responses: {
                        201: { $ref: '#/components/responses/Created' },
                        400: { $ref: '#/components/responses/ValidationError' },
                    },
                },
            },
            '/api/sessions/login': {
                post: {
                    tags: ['Sessions'],
                    summary: 'Login de usuario',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SessionLoginInput' },
                            },
                        },
                    },
                    responses: {
                        200: { $ref: '#/components/responses/Success' },
                        400: { $ref: '#/components/responses/ValidationError' },
                    },
                },
            },

            // ---------- ADOPTIONS (para mostrar otro POST) ----------
            '/api/adoptions/{uid}/{pid}': {
                post: {
                    tags: ['Adoptions'],
                    summary: 'Adoptar una mascota',
                    parameters: [
                        { $ref: '#/components/parameters/UidParam' },
                        { $ref: '#/components/parameters/PidParam' },
                    ],
                    responses: {
                        200: {
                            description: 'Adopción exitosa',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'success' },
                                            message: { type: 'string', example: 'Pet adopted' },
                                        },
                                    },
                                },
                            },
                        },
                        400: {
                            description: 'Mascota ya adoptada',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'error' },
                                            error: {
                                                type: 'string',
                                                example: 'Pet is already adopted',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        404: { $ref: '#/components/responses/NotFound' },
                    },
                },
            },
        },
    },
    apis: [], // uso solo este archivo para mantener todo centralizado
};

const swaggerSpecs = swaggerJsdoc(options);
export default swaggerSpecs;
