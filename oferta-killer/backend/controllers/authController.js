const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * Controller de Autenticação
 * Gerencia registro, login e operações relacionadas ao usuário
 */

/**
 * Gera token JWT para o usuário
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * Registro de novo usuário
 * POST /api/auth/register
 */
const register = async (req, res) => {
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

    const { name, email, password } = req.body;

    // Verifica se o email já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Cria novo usuário
    const user = new User({
      name,
      email,
      password // Será hasheado pelo middleware do modelo
    });

    await user.save();

    // Gera token
    const token = generateToken(user._id);

    // Atualiza último login
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          monthlyLimits: user.monthlyLimits,
          currentMonth: user.currentMonth
        },
        token
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Login do usuário
 * POST /api/auth/login
 */
const login = async (req, res) => {
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

    const { email, password } = req.body;

    // Busca usuário por email (incluindo senha)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verifica se a conta está ativa
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada. Entre em contato com o suporte.'
      });
    }

    // Verifica senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Gera token
    const token = generateToken(user._id);

    // Atualiza último login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          monthlyLimits: user.monthlyLimits,
          currentMonth: user.currentMonth,
          lastLogin: user.lastLogin
        },
        token
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Obter dados do usuário atual
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          monthlyLimits: user.monthlyLimits,
          currentMonth: user.currentMonth,
          subscriptionStatus: user.subscriptionStatus,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Atualizar perfil do usuário
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
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

    const { name } = req.body;
    const userId = req.user._id;

    // Atualiza apenas campos permitidos
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          plan: updatedUser.plan
        }
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Alterar senha do usuário
 * PUT /api/auth/password
 */
const changePassword = async (req, res) => {
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

    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Busca usuário com senha
    const user = await User.findById(userId).select('+password');
    
    // Verifica senha atual
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Atualiza senha
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Verificar status da conta
 * GET /api/auth/status
 */
const getAccountStatus = async (req, res) => {
  try {
    const user = req.user;
    
    // Calcula dias restantes para reset do limite
    const now = new Date();
    const resetDate = new Date(user.currentMonth.resetDate);
    const daysUntilReset = Math.ceil((resetDate - now) / (1000 * 60 * 60 * 24));
    
    res.json({
      success: true,
      data: {
        plan: user.plan,
        limits: {
          offersGenerated: {
            current: user.currentMonth.offersGenerated,
            limit: user.monthlyLimits.offersGenerated,
            remaining: user.monthlyLimits.offersGenerated - user.currentMonth.offersGenerated
          }
        },
        resetInfo: {
          resetDate: user.currentMonth.resetDate,
          daysUntilReset: Math.max(0, daysUntilReset)
        },
        subscription: {
          status: user.subscriptionStatus,
          isActive: user.isActive
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar status da conta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getAccountStatus
};