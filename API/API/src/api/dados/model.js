import mongoose, { Schema } from 'mongoose'

const dadosSchema = new Schema({
  propriedade: String,
  municipio: String,
  regiao: String
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

dadosSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      propriedade: this.propriedade,
      municipio: this.municipio,
      regiao: this.regiao,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? { ...view } : view
  }
}

const Dados = mongoose.model('Dados', dadosSchema)

export default Dados
export const schema = Dados.schema
