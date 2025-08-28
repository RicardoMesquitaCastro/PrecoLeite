import mongoose, { Schema } from 'mongoose'

const dadosSchema = new Schema({
  propriedade: {
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

dadosSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      propriedade: this.propriedade,
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

const model = mongoose.model('Dados', dadosSchema)

export const schema = model.schema
export default model
