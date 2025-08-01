const axios = require('axios');

/**
 * Serviço de IA para geração de ofertas
 * Integra com OpenAI GPT para criar ofertas irresistíveis
 */
class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-4';
  }

  /**
   * Gera uma oferta irresistível baseada nos dados do produto
   * @param {Object} inputData - Dados do produto fornecidos pelo usuário
   * @returns {Object} Oferta gerada pela IA
   */
  async generateOffer(inputData) {
    try {
      const { productName, currentPrice, targetAudience, competition, uniqueDifferential } = inputData;
      
      // Se não há chave da OpenAI, usa dados mockados
      if (!this.apiKey || this.apiKey === 'sua_chave_openai_aqui') {
        return this._generateMockOffer(inputData);
      }

      const prompt = this._createPrompt(inputData);
      
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: "system",
              content: "Você é um especialista em copywriting e marketing digital que cria ofertas irresistíveis. Sempre responda em formato JSON válido."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      return this._parseAIResponse(aiResponse);
      
    } catch (error) {
      console.error('Erro ao gerar oferta com IA:', error.message);
      
      // Em caso de erro, retorna oferta mockada
      return this._generateMockOffer(inputData);
    }
  }

  /**
   * Cria o prompt para a IA baseado nos dados do produto
   */
  _createPrompt(inputData) {
    const { productName, currentPrice, targetAudience, competition, uniqueDifferential } = inputData;
    
    return `
Crie uma oferta irresistível para o seguinte produto digital:

**INFORMAÇÕES DO PRODUTO:**
- Nome: ${productName}
- Preço Atual: R$ ${currentPrice}
- Público-Alvo: ${targetAudience}
- Concorrência: ${competition}
- Diferencial Único: ${uniqueDifferential}

**INSTRUÇÕES:**
Crie uma oferta completa que converta mais vendas usando gatilhos mentais e técnicas de copywriting. 

Retorne APENAS um JSON válido com esta estrutura:
{
  "offerName": "Nome atrativo da oferta",
  "headline": "Headline persuasiva e impactante",
  "valueProposition": "Promessa de valor clara e específica",
  "positioning": "Como posicionar a oferta no mercado",
  "irresistibleOffer": "Descrição completa da oferta irresistível",
  "bonuses": [
    {
      "name": "Nome do Bônus 1",
      "description": "Descrição detalhada do bônus",
      "value": 197
    },
    {
      "name": "Nome do Bônus 2", 
      "description": "Descrição detalhada do bônus",
      "value": 97
    }
  ],
  "guarantee": "Garantia convincente e específica",
  "mentalTriggers": ["Escassez", "Urgência", "Autoridade"]
}

**IMPORTANTE:**
- Use gatilhos mentais poderosos
- Seja específico e persuasivo
- Crie bônus valiosos e relevantes
- A garantia deve remover objeções
- Foque na transformação do cliente
`;
  }

  /**
   * Processa a resposta da IA e converte para objeto JavaScript
   */
  _parseAIResponse(aiResponse) {
    try {
      // Remove possível markdown formatting
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Erro ao fazer parse da resposta da IA:', error);
      throw new Error('Resposta da IA em formato inválido');
    }
  }

  /**
   * Gera uma oferta mockada para desenvolvimento/teste
   */
  _generateMockOffer(inputData) {
    const { productName, currentPrice, targetAudience } = inputData;
    
    // Lista de gatilhos mentais para usar aleatoriamente
    const allTriggers = ['Escassez', 'Urgência', 'Autoridade', 'Prova Social', 'Reciprocidade'];
    const selectedTriggers = this._getRandomElements(allTriggers, 3);
    
    return {
      offerName: `${productName} - Oferta Especial de Lançamento`,
      headline: `Transforme Sua Vida com ${productName} - Por Tempo Limitado!`,
      valueProposition: `Descobra como ${productName} pode revolucionar seus resultados de forma rápida e garantida, mesmo que você seja iniciante no assunto.`,
      positioning: `O único ${productName.toLowerCase()} no mercado que combina simplicidade com resultados comprovados, especialmente desenvolvido para ${targetAudience}.`,
      irresistibleOffer: `Adquira agora o ${productName} completo por apenas R$ ${currentPrice} (valor normal R$ ${Math.round(currentPrice * 2.5)}) e ganhe acesso imediato a todo conteúdo + bônus exclusivos. Esta oferta especial é válida apenas nas próximas 48 horas!`,
      bonuses: [
        {
          name: "Masterclass Exclusiva de Implementação",
          description: "Aula ao vivo de 2 horas mostrando passo a passo como aplicar tudo que você aprendeu, com casos reais e tirando todas suas dúvidas.",
          value: Math.round(currentPrice * 0.8)
        },
        {
          name: "Templates Prontos para Usar",
          description: "Kit completo com 15+ templates testados e aprovados que você pode usar imediatamente para acelerar seus resultados.",
          value: Math.round(currentPrice * 0.5)
        },
        {
          name: "Suporte Direto por 30 dias",
          description: "Acesso direto comigo via WhatsApp para tirar dúvidas e garantir que você implemente tudo corretamente.",
          value: Math.round(currentPrice * 1.2)
        }
      ],
      guarantee: `Garantia Blindada de 30 dias: Se você não ficar 100% satisfeito com os resultados do ${productName}, devolvemos todo seu dinheiro sem fazer perguntas. Você só tem a ganhar!`,
      mentalTriggers: selectedTriggers
    };
  }

  /**
   * Seleciona elementos aleatórios de um array
   */
  _getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Regenera uma oferta com variações
   */
  async regenerateOffer(inputData, previousOffer) {
    try {
      // Adiciona contexto da oferta anterior para gerar variação
      const enhancedInputData = {
        ...inputData,
        previousOfferContext: `Oferta anterior gerada: ${previousOffer.headline}`
      };
      
      return await this.generateOffer(enhancedInputData);
    } catch (error) {
      console.error('Erro ao regenerar oferta:', error);
      throw error;
    }
  }

  /**
   * Valida se a resposta da IA está no formato correto
   */
  _validateOfferStructure(offer) {
    const requiredFields = [
      'offerName', 'headline', 'valueProposition', 
      'positioning', 'irresistibleOffer', 'bonuses', 
      'guarantee', 'mentalTriggers'
    ];
    
    for (const field of requiredFields) {
      if (!offer[field]) {
        throw new Error(`Campo obrigatório ausente: ${field}`);
      }
    }
    
    if (!Array.isArray(offer.bonuses) || offer.bonuses.length === 0) {
      throw new Error('Bônus devem ser um array não vazio');
    }
    
    if (!Array.isArray(offer.mentalTriggers)) {
      throw new Error('Gatilhos mentais devem ser um array');
    }
    
    return true;
  }
}

module.exports = new AIService();