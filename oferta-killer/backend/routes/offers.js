const express = require('express');
const { body, param, query } = require('express-validator');
const offerController = require('../controllers/offerController');
const { authenticate, checkOfferLimit } = require('../middleware/auth');

const router = express.Router();

/**
 * Validações para criação de oferta
 */
const createOfferValidation = [
  body('productName')
    .notEmpty()
    .withMessage('Nome do produto é obrigatório')
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome do produto deve ter entre 2 e 200 caracteres')
    .trim(),
  
  body('currentPrice')
    .isNumeric()
    .withMessage('Preço deve ser um número')
    .isFloat({ min: 0.01 })
    .withMessage('Preço deve ser maior que zero'),
  
  body('targetAudience')
    .notEmpty()
    .withMessage('Público-alvo é obrigatório')
    .isLength({ min: 5, max: 500 })
    .withMessage('Público-alvo deve ter entre 5 e 500 caracteres')
    .trim(),
  
  body('competition')
    .notEmpty()
    .withMessage('Descrição da concorrência é obrigatória')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Descrição da concorrência deve ter entre 5 e 1000 caracteres')
    .trim(),
  
  body('uniqueDifferential')
    .notEmpty()
    .withMessage('Diferencial do produto é obrigatório')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Diferencial deve ter entre 5 e 1000 caracteres')
    .trim()
];

/**
 * Validações para atualização de oferta
 */
const updateOfferValidation = [
  body('status')
    .optional()
    .isIn(['draft', 'active', 'archived'])
    .withMessage('Status deve ser: draft, active ou archived'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags devem ser um array'),
  
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Cada tag deve ter entre 1 e 50 caracteres')
    .trim()
    .toLowerCase(),
  
  body('isFavorite')
    .optional()
    .isBoolean()
    .withMessage('isFavorite deve ser um boolean')
];

/**
 * Validação para parâmetros de ID
 */
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID inválido')
];

/**
 * Validações para query parameters de listagem
 */
const listValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limite deve ser entre 1 e 50'),
  
  query('status')
    .optional()
    .isIn(['draft', 'active', 'archived'])
    .withMessage('Status deve ser: draft, active ou archived'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Busca deve ter entre 1 e 100 caracteres')
    .trim(),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'inputData.productName', 'stats.views', 'stats.copies'])
    .withMessage('Campo de ordenação inválido'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Ordem deve ser asc ou desc')
];

// Todas as rotas requerem autenticação
router.use(authenticate);

// Rotas de ofertas
router.get('/stats', offerController.getStats);
router.get('/', listValidation, offerController.getOffers);
router.post('/', checkOfferLimit, createOfferValidation, offerController.createOffer);

router.get('/:id', idValidation, offerController.getOffer);
router.put('/:id', idValidation, updateOfferValidation, offerController.updateOffer);
router.delete('/:id', idValidation, offerController.deleteOffer);

// Ações específicas da oferta
router.post('/:id/regenerate', idValidation, checkOfferLimit, offerController.regenerateOffer);
router.post('/:id/copy', idValidation, offerController.copyOffer);
router.post('/:id/favorite', idValidation, offerController.toggleFavorite);

module.exports = router;