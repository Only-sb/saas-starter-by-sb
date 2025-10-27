const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e adiciona o usuário ao req.user
 */
const authenticate = async (req, res, next) => {
  try {
    // Pega o token do header Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acesso negado. Token não fornecido.'
      });
    }
    
    // Remove "Bearer " do início
    const token = authHeader.substring(7);
    
    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Busca o usuário no banco
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Usuário não encontrado.'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada.'
      });
    }
    
    // Adiciona o usuário ao request
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado.'
      });
    }
    
    console.error('Erro na autenticação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
};

/**
 * Middleware para verificar limites do plano
 * Verifica se o usuário pode gerar mais ofertas baseado no seu plano
 */
const checkOfferLimit = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Verifica se pode gerar mais ofertas
    if (!user.canGenerateOffer()) {
      return res.status(403).json({
        success: false,
        message: `Limite de ofertas mensais atingido. Seu plano ${user.plan} permite ${user.monthlyLimits.offersGenerated} ofertas por mês.`,
        data: {
          currentCount: user.currentMonth.offersGenerated,
          limit: user.monthlyLimits.offersGenerated,
          plan: user.plan,
          resetDate: user.currentMonth.resetDate
        }
      });
    }
    
    next();
  } catch (error) {
    console.error('Erro ao verificar limite:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
};

/**
 * Middleware para verificar planos específicos
 * @param {Array} allowedPlans - Array de planos permitidos
 */
const requirePlan = (allowedPlans) => {
  return (req, res, next) => {
    const userPlan = req.user.plan;
    
    if (!allowedPlans.includes(userPlan)) {
      return res.status(403).json({
        success: false,
        message: `Esta funcionalidade requer um dos seguintes planos: ${allowedPlans.join(', ')}. Seu plano atual: ${userPlan}`
      });
    }
    
    next();
  };
};

/**
 * Middleware opcional de autenticação
 * Não retorna erro se não autenticado, apenas adiciona user se token válido
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Ignora erros na autenticação opcional
    next();
  }
};

module.exports = {
  authenticate,
  checkOfferLimit,
  requirePlan,
  optionalAuth
};