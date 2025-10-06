import mongoose, { Schema } from 'mongoose'

const cadastroPropriedadeSchema = new Schema({
  cadastroId: {
    type: String
  },
  nomePropriedade: {
    type: String
  },
  municipio: {
    type: String
  },
  regiao: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

cadastroPropriedadeSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      cadastroId: this.cadastroId,
      nomePropriedade: this.nomePropriedade,
      municipio: this.municipio,
      regiao: this.regiao,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('CadastroPropriedade', cadastroPropriedadeSchema)

export const schema = model.schema
export default model
