const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título da oferta é obrigatório'],
    trim: true,
    maxlength: [200, 'Título não pode ter mais de 200 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Descrição da oferta é obrigatória'],
    maxlength: [1000, 'Descrição não pode ter mais de 1000 caracteres']
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['tecnologia', 'moda', 'casa', 'esportes', 'alimentacao', 'saude', 'educacao', 'viagem', 'outros']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Preço original é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  discountPrice: {
    type: Number,
    required: [true, 'Preço com desconto é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Desconto não pode ser negativo'],
    max: [100, 'Desconto não pode ser maior que 100%']
  },
  validUntil: {
    type: Date,
    required: [true, 'Data de validade é obrigatória']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calcular porcentagem de desconto antes de salvar
offerSchema.pre('save', function(next) {
  if (this.originalPrice && this.discountPrice) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.discountPrice) / this.originalPrice) * 100
    );
  }
  this.updatedAt = Date.now();
  next();
});

// Índices para melhor performance
offerSchema.index({ category: 1, isActive: 1 });
offerSchema.index({ validUntil: 1 });
offerSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Offer', offerSchema);