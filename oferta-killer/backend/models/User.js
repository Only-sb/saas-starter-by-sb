const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schema do Usuário
 * Contém informações básicas do usuário, plano, limites e estatísticas
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
    select: false // Não retorna a senha por padrão nas consultas
  },
  
  plan: {
    type: String,
    enum: ['Basic', 'Pro', 'Premium'],
    default: 'Basic'
  },
  
  // Limites mensais baseados no plano
  monthlyLimits: {
    offersGenerated: {
      type: Number,
      default: function() {
        switch(this.plan) {
          case 'Basic': return 10;
          case 'Pro': return 50;
          case 'Premium': return 200;
          default: return 10;
        }
      }
    }
  },
  
  // Contadores do mês atual
  currentMonth: {
    offersGenerated: {
      type: Number,
      default: 0
    },
    resetDate: {
      type: Date,
      default: function() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 1);
      }
    }
  },
  
  // Informações da assinatura Stripe
  stripeCustomerId: {
    type: String,
    default: null
  },
  
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'canceled', 'past_due'],
    default: 'active'
  },
  
  subscriptionId: {
    type: String,
    default: null
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index para busca por email
userSchema.index({ email: 1 });

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  // Só executa se a senha foi modificada
  if (!this.isModified('password')) return next();
  
  // Hash da senha com salt de 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Middleware para resetar contadores mensais
userSchema.pre('save', function(next) {
  const now = new Date();
  if (now >= this.currentMonth.resetDate) {
    this.currentMonth.offersGenerated = 0;
    this.currentMonth.resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
  next();
});

// Método para verificar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para verificar se pode gerar mais ofertas
userSchema.methods.canGenerateOffer = function() {
  return this.currentMonth.offersGenerated < this.monthlyLimits.offersGenerated;
};

// Método para incrementar contador de ofertas
userSchema.methods.incrementOfferCount = function() {
  this.currentMonth.offersGenerated += 1;
  return this.save();
};

// Método para atualizar plano e limites
userSchema.methods.updatePlan = function(newPlan) {
  this.plan = newPlan;
  
  // Atualiza limites baseado no plano
  switch(newPlan) {
    case 'Basic':
      this.monthlyLimits.offersGenerated = 10;
      break;
    case 'Pro':
      this.monthlyLimits.offersGenerated = 50;
      break;
    case 'Premium':
      this.monthlyLimits.offersGenerated = 200;
      break;
  }
  
  return this.save();
};

// Remove campos sensíveis do JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.stripeCustomerId;
  delete user.subscriptionId;
  return user;
};

module.exports = mongoose.model('User', userSchema);