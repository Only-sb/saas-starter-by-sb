const { validationResult } = require('express-validator');
const Offer = require('../models/Offer');
const aiService = require('../services/aiService');

/**
 * Controller de Ofertas
 * Gerencia criação, listagem, edição e exclusão de ofertas
 */

/**
 * Criar nova oferta
 * POST /api/offers
 */
const createOffer = async (req, res) => {
  try {
    // Verifica se há erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const { productName, currentPrice, targetAudience, competition, uniqueDifferential } = req.body;

    const inputData = {
      productName,
      currentPrice,
      targetAudience,
      competition,
      uniqueDifferential
    };

    // Gera a oferta usando IA
    const generatedOffer = await aiService.generateOffer(inputData);

    // Cria nova oferta no banco
    const offer = new Offer({
      user: userId,
      inputData,
      generatedOffer
    });

    await offer.save();

    // Incrementa contador de ofertas do usuário
    await req.user.incrementOfferCount();

    res.status(201).json({
      success: true,
      message: 'Oferta criada com sucesso',
      data: {
        offer
      }
    });

  } catch (error) {
    console.error('Erro ao criar oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Listar ofertas do usuário
 * GET /api/offers
 */
const getOffers = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Constrói filtros
    const filters = { user: userId };
    
    if (status && ['draft', 'active', 'archived'].includes(status)) {
      filters.status = status;
    }

    if (search) {
      filters['inputData.productName'] = { $regex: search, $options: 'i' };
    }

    // Contagem total
    const total = await Offer.countDocuments(filters);

    // Busca ofertas com paginação
    const offers = await Offer.find(filters)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-versions'); // Exclui versões para performance

    // Calcula informações da paginação
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        offers,
        pagination: {
          current: page,
          total: totalPages,
          hasNext: hasNextPage,
          hasPrev: hasPrevPage,
          totalItems: total
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar ofertas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Obter oferta específica
 * GET /api/offers/:id
 */
const getOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const offer = await Offer.findOne({ _id: id, user: userId });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    // Incrementa visualizações
    await offer.incrementViews();

    res.json({
      success: true,
      data: {
        offer
      }
    });

  } catch (error) {
    console.error('Erro ao buscar oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Atualizar oferta
 * PUT /api/offers/:id
 */
const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { status, tags, isFavorite } = req.body;

    const offer = await Offer.findOne({ _id: id, user: userId });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    // Atualiza campos permitidos
    if (status !== undefined) offer.status = status;
    if (tags !== undefined) offer.tags = tags;
    if (isFavorite !== undefined) offer.isFavorite = isFavorite;

    await offer.save();

    res.json({
      success: true,
      message: 'Oferta atualizada com sucesso',
      data: {
        offer
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Regenerar oferta com IA
 * POST /api/offers/:id/regenerate
 */
const regenerateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const offer = await Offer.findOne({ _id: id, user: userId });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    // Regenera oferta com IA
    const newGeneratedOffer = await aiService.regenerateOffer(
      offer.inputData,
      offer.generatedOffer
    );

    // Cria nova versão mantendo histórico
    await offer.createVersion(newGeneratedOffer);

    res.json({
      success: true,
      message: 'Oferta regenerada com sucesso',
      data: {
        offer
      }
    });

  } catch (error) {
    console.error('Erro ao regenerar oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Copiar oferta (incrementa contador)
 * POST /api/offers/:id/copy
 */
const copyOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const offer = await Offer.findOne({ _id: id, user: userId });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    // Incrementa contador de cópias
    await offer.incrementCopies();

    res.json({
      success: true,
      message: 'Oferta copiada',
      data: {
        offer: {
          id: offer._id,
          stats: offer.stats
        }
      }
    });

  } catch (error) {
    console.error('Erro ao copiar oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Favoritar/desfavoritar oferta
 * POST /api/offers/:id/favorite
 */
const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const offer = await Offer.findOne({ _id: id, user: userId });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    await offer.toggleFavorite();

    res.json({
      success: true,
      message: offer.isFavorite ? 'Oferta favoritada' : 'Oferta removida dos favoritos',
      data: {
        offer: {
          id: offer._id,
          isFavorite: offer.isFavorite
        }
      }
    });

  } catch (error) {
    console.error('Erro ao favoritar oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Deletar oferta
 * DELETE /api/offers/:id
 */
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const offer = await Offer.findOne({ _id: id, user: userId });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Oferta não encontrada'
      });
    }

    await Offer.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Oferta deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar oferta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Obter estatísticas das ofertas do usuário
 * GET /api/offers/stats
 */
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Agregação para estatísticas
    const stats = await Offer.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalOffers: { $sum: 1 },
          totalViews: { $sum: '$stats.views' },
          totalCopies: { $sum: '$stats.copies' },
          favoriteCount: {
            $sum: { $cond: [{ $eq: ['$isFavorite', true] }, 1, 0] }
          },
          statusBreakdown: {
            $push: '$status'
          }
        }
      }
    ]);

    // Estatísticas por status
    const statusCounts = await Offer.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Ofertas mais recentes
    const recentOffers = await Offer.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('inputData.productName generatedOffer.headline createdAt stats');

    const result = {
      total: stats[0]?.totalOffers || 0,
      totalViews: stats[0]?.totalViews || 0,
      totalCopies: stats[0]?.totalCopies || 0,
      favoriteCount: stats[0]?.favoriteCount || 0,
      byStatus: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentOffers
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  regenerateOffer,
  copyOffer,
  toggleFavorite,
  deleteOffer,
  getStats
};