const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Offer = require('../models/Offer');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Validações para criação de oferta
const createOfferValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Título deve ter entre 5 e 200 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Descrição deve ter entre 10 e 1000 caracteres'),
  body('category')
    .isIn(['tecnologia', 'moda', 'casa', 'esportes', 'alimentacao', 'saude', 'educacao', 'viagem', 'outros'])
    .withMessage('Categoria inválida'),
  body('originalPrice')
    .isFloat({ min: 0.01 })
    .withMessage('Preço original deve ser maior que 0'),
  body('discountPrice')
    .isFloat({ min: 0.01 })
    .withMessage('Preço com desconto deve ser maior que 0'),
  body('validUntil')
    .isISO8601()
    .withMessage('Data de validade inválida')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Data de validade deve ser futura');
      }
      return true;
    }),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags devem ser um array'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('URL da imagem inválida')
];

// @desc    Criar nova oferta
// @route   POST /api/offers
// @access  Private
router.post('/', authenticate, createOfferValidation, async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { title, description, category, originalPrice, discountPrice, validUntil, tags, imageUrl } = req.body;

    // Verificar se o preço com desconto é menor que o original
    if (discountPrice >= originalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Preço com desconto deve ser menor que o preço original'
      });
    }

    // Criar oferta
    const offer = await Offer.create({
      title,
      description,
      category,
      originalPrice,
      discountPrice,
      validUntil,
      tags: tags || [],
      imageUrl,
      createdBy: req.user._id
    });

    // Buscar oferta com dados do criador
    const populatedOffer = await Offer.findById(offer._id)
      .populate('createdBy', 'name email')
      .exec();

    res.status(201).json({
      success: true,
      message: 'Oferta criada com sucesso',
      data: {
        offer: populatedOffer
      }
    });
  } catch (error) {
    console.error('Erro ao criar oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @desc    Obter todas as ofertas ativas
// @route   GET /api/offers
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número positivo'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limite deve ser entre 1 e 50'),
  query('category').optional().isIn(['tecnologia', 'moda', 'casa', 'esportes', 'alimentacao', 'saude', 'educacao', 'viagem', 'outros']).withMessage('Categoria inválida'),
  query('minDiscount').optional().isInt({ min: 0, max: 100 }).withMessage('Desconto mínimo deve ser entre 0 e 100'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Preço máximo deve ser positivo'),
  query('search').optional().isLength({ min: 2 }).withMessage('Termo de busca deve ter pelo menos 2 caracteres')
], async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Construir filtros
    const filters = {
      isActive: true,
      validUntil: { $gt: new Date() }
    };

    if (req.query.category) {
      filters.category = req.query.category;
    }

    if (req.query.minDiscount) {
      filters.discountPercentage = { $gte: parseInt(req.query.minDiscount) };
    }

    if (req.query.maxPrice) {
      filters.discountPrice = { $lte: parseFloat(req.query.maxPrice) };
    }

    if (req.query.search) {
      filters.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Buscar ofertas
    const offers = await Offer.find(filters)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Contar total de ofertas
    const total = await Offer.countDocuments(filters);

    res.json({
      success: true,
      data: {
        offers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar ofertas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @desc    Obter oferta por ID
// @route   GET /api/offers/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('createdBy', 'name email createdAt')
      .exec();

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        offer
      }
    });
  } catch (error) {
    console.error('Erro ao buscar oferta:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @desc    Obter ofertas do usuário logado
// @route   GET /api/offers/my/offers
// @access  Private
router.get('/my/offers', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const offers = await Offer.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Offer.countDocuments({ createdBy: req.user._id });

    res.json({
      success: true,
      data: {
        offers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar ofertas do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @desc    Atualizar oferta
// @route   PUT /api/offers/:id
// @access  Private
router.put('/:id', authenticate, createOfferValidation, async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    // Verificar se o usuário é o criador da oferta ou admin
    if (offer.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a atualizar esta oferta'
      });
    }

    const { title, description, category, originalPrice, discountPrice, validUntil, tags, imageUrl, isActive } = req.body;

    // Verificar se o preço com desconto é menor que o original
    if (discountPrice >= originalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Preço com desconto deve ser menor que o preço original'
      });
    }

    // Atualizar oferta
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        originalPrice,
        discountPrice,
        validUntil,
        tags: tags || [],
        imageUrl,
        isActive: isActive !== undefined ? isActive : offer.isActive
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Oferta atualizada com sucesso',
      data: {
        offer: updatedOffer
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar oferta:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @desc    Deletar oferta
// @route   DELETE /api/offers/:id
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    // Verificar se o usuário é o criador da oferta ou admin
    if (offer.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a deletar esta oferta'
      });
    }

    await Offer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Oferta deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar oferta:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @desc    Obter estatísticas das ofertas (apenas admin)
// @route   GET /api/offers/admin/stats
// @access  Private/Admin
router.get('/admin/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalOffers = await Offer.countDocuments();
    const activeOffers = await Offer.countDocuments({ isActive: true, validUntil: { $gt: new Date() } });
    const expiredOffers = await Offer.countDocuments({ validUntil: { $lte: new Date() } });
    const inactiveOffers = await Offer.countDocuments({ isActive: false });

    // Ofertas por categoria
    const offersByCategory = await Offer.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Ofertas criadas nos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOffers = await Offer.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    res.json({
      success: true,
      data: {
        stats: {
          totalOffers,
          activeOffers,
          expiredOffers,
          inactiveOffers,
          recentOffers,
          offersByCategory
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;