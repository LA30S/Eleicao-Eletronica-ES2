const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'API - Eleição Eletrônica',
      version: '1.0.0',
      description: 'Documentação da API do sistema de eleição eletrônica.'
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },

      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            nome: {
              type: 'string',
              example: 'Marcio'
            },
            login: {
              type: 'string',
              example: '123456'
            },
            senha: {
              type: 'string',
              example: 'senha123'
            },
            votou: {
              type: 'boolean',
              example: false
            }
          }
        },
        
        NovoUsuario: {
          type: 'object',
          required: ['nome', 'login', 'senha'],
          properties: {
            nome: {
              type: 'string',
              example: 'Marcio'
            },
            login: {
              type: 'string',
              example: '123456'
            },
            senha: {
              type: 'string',
              example: 'senha123',
              writeOnly: true
            }
          }
        },

        Candidato: {
          type: 'object',
          required: ['nome', 'numero', 'senha', 'cargo', 'partido'],
          properties: {
            _id: {
              type: 'string',
              example: 'string'
            },
            nome: {
              type: 'string',
              example: 'Fabricio'
            },
            numero: {
              type: 'integer',
              example: 50
            },
            senha: {
              type: 'string',
              example: 'senha123',
              writeOnly: true
            },
            cargo: {
              type: 'string',
              enum: [
                'A definir',
                'Deputado Estadual',
                'Deputado Federal',
                'Senador',
                'Governador',
                'Presidente da República'
              ],
              example: 'Presidente da República'
            },
            partido: {
              type: 'string',
              example: 'Partido Exemplar'
            }
          }
        },

        Eleicao: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: 'string'
            },
            data: {
              type: 'string',
              format: 'date-time',
              example: '2026-11-20T00:00:00.000Z'
            },
            turno: {
              type: 'integer',
              example: 1
            },
            abertura: {
              type: 'string',
              example: '08:00'
            },
            encerramento: {
              type: 'string',
              example: '17:00'
            },
            situacao: {
              type: 'string',
              enum: ['AGENDADA', 'ABERTA', 'ENCERRADA'],
              example: 'AGENDADA'
            }
          }
        },

        NovaEleicao: {
          type: 'object',
          required: ['data', 'turno', 'abertura', 'encerramento'],
          properties: {
            data: {
              type: 'string',
              format: 'date-time',
              example: '2026-11-20T00:00:00.000Z'
            },
            turno: {
              type: 'integer',
              example: 1
            },
            abertura: {
              type: 'string',
              example: '08:00'
            },
            encerramento: {
              type: 'string',
              example: '17:00'
            }
          }
        },

        Voto: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: 'string'
            },
            numCandidato: {
              type: 'integer',
              example: 50
            },
            cargo: {
              type: 'string',
              example: 'Presidente da República'
            }
          }
        },

        NovoVoto: {
          type: 'object',
          properties: {
            numCandidato: {
              type: 'integer',
              example: 50
            },
            cargo: {
              type: 'string',
              example: 'Presidente da República'
            }
          }
        },

        ResultadoVotos: {
          type: 'object',
          properties: {
            _id: {
              type: 'integer',
              example: 123
            },
            quantidade: {
              type: 'integer',
              example: 150
            }
          }
        },

        Chefe: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: 'string'
            },
            nome: {
              type: 'string',
              example: 'Maria'
            },
            login: {
              type: 'string',
              example: '654321'
            }
          }
        },
        
        NovoChefe: {
          type: 'object',
          required: ['nome', 'login', 'senha'],
          properties: {
            nome: {
              type: 'string',
              example: 'Maria'
            },
            login: {
              type: 'string',
              example: '654321'
            },
            senha: {
              type: 'string',
              example: 'senha123',
              writeOnly: true
            }
          }
        }


      }
    }
  },

  apis: [
    path.join(__dirname, 'routes', '*.js')
  ],

  failOnErrors: true
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
