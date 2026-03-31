import mongoose, { Schema } from 'mongoose'

const cotacaoSchema = new Schema({
  mes: {
    type: String,
    required: true,
    trim: true
    // ex: "Jan/2025"
  },
  preco: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

cotacaoSchema.methods = {
  view () {
    return {
      id: this.id,
      mes: this.mes,
      preco: this.preco,
      createdAt: this.createdAt
    }
  }
}

export const Cotacao =
  mongoose.models.Cotacao || mongoose.model('Cotacao', cotacaoSchema)

export const schema = Cotacao.schema
export default Cotacao
