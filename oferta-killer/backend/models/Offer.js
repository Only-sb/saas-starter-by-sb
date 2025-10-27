const mongoose = require('mongoose');

/**
 * Schema da Oferta
 * Contém todas as informações de entrada e a oferta gerada pela IA
 */
const offerSchema = new mongoose.Schema({
  // Referência ao usuário que criou a oferta
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Dados de entrada fornecidos pelo usuário
  inputData: {
    productName: {
      type: String,
      required: [true, 'Nome do produto é obrigatório'],
      trim: true,
      maxlength: [200, 'Nome do produto deve ter no máximo 200 caracteres']
    },
    
    currentPrice: {
      type: Number,
      required: [true, 'Preço atual é obrigatório'],
      min: [0, 'Preço deve ser maior que zero']
    },
    
    targetAudience: {
      type: String,
      required: [true, 'Público-alvo é obrigatório'],
      trim: true,
      maxlength: [500, 'Público-alvo deve ter no máximo 500 caracteres']
    },
    
    competition: {
      type: String,
      required: [true, 'Descrição da concorrência é obrigatória'],
      trim: true,
      maxlength: [1000, 'Descrição da concorrência deve ter no máximo 1000 caracteres']
    },
    
    uniqueDifferential: {
      type: String,
      required: [true, 'Diferencial do produto é obrigatório'],
      trim: true,
      maxlength: [1000, 'Diferencial deve ter no máximo 1000 caracteres']
    }
  },
  
  // Oferta gerada pela IA
  generatedOffer: {
    offerName: {
      type: String,
      required: true,
      trim: true
    },
    
    headline: {
      type: String,
      required: true,
      trim: true
    },
    
    valueProposition: {
      type: String,
      required: true,
      trim: true
    },
    
    positioning: {
      type: String,
      required: true,
      trim: true
    },
    
    irresistibleOffer: {
      type: String,
      required: true,
      trim: true
    },
    
    bonuses: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      value: {
        type: Number,
        default: 0
      }
    }],
    
    guarantee: {
      type: String,
      required: true,
      trim: true
    },
    
    // Gatilhos mentais aplicados
    mentalTriggers: [{
      type: String,
      enum: [
        'Escassez',
        'Urgência',
        'Autoridade',
        'Prova Social',
        'Reciprocidade',
        'Compromisso',
        'Aversão à Perda',
        'Exclusividade'
      ]
    }]
  },
  
  // Status da oferta
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'active'
  },
  
  // Estatísticas de uso
  stats: {
    views: {
      type: Number,
      default: 0
    },
    copies: {
      type: Number,
      default: 0
    },
    lastViewed: {
      type: Date,
      default: null
    }
  },
  
  // Versões da oferta (para histórico de edições)
  versions: [{
    versionNumber: {
      type: Number,
      required: true
    },
    generatedOffer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tags para organização
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Favoritar oferta
  isFavorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes para performance
offerSchema.index({ user: 1, createdAt: -1 });
offerSchema.index({ user: 1, status: 1 });
offerSchema.index({ user: 1, isFavorite: 1 });
offerSchema.index({ 'inputData.productName': 'text' });

// Middleware para incrementar views
offerSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  this.stats.lastViewed = new Date();
  return this.save();
};

// Middleware para incrementar copies
offerSchema.methods.incrementCopies = function() {
  this.stats.copies += 1;
  return this.save();
};

// Método para criar nova versão
offerSchema.methods.createVersion = function(newGeneratedOffer) {
  const versionNumber = this.versions.length + 1;
  
  this.versions.push({
    versionNumber,
    generatedOffer: this.generatedOffer,
    createdAt: new Date()
  });
  
  this.generatedOffer = newGeneratedOffer;
  return this.save();
};

// Método para toggle favorito
offerSchema.methods.toggleFavorite = function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

// Virtual para calcular valor total dos bônus
offerSchema.virtual('totalBonusValue').get(function() {
  return this.generatedOffer.bonuses.reduce((total, bonus) => total + bonus.value, 0);
});

// Virtual para calcular valor total da oferta
offerSchema.virtual('totalOfferValue').get(function() {
  return this.inputData.currentPrice + this.totalBonusValue;
});

// Ensure virtual fields are serialized
offerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Offer', offerSchema);