import mongoose, { Schema } from 'mongoose'

const cadastroParametrosSchema = new Schema({
  contaId: {
    type: String
  },
  laticinio: {
    type: String
  },
  mesReferencia: {
    type: String
  },
  precoLeite: {
    type: String
  },
  producaoLitros: {
    type: String
  },
  ccs: {
    type: String
  },
  cbt: {
    type: String
  },
  gordura: {
    type: String
  },
  proteina: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

cadastroParametrosSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      contaId: this.contaId,
      laticinio: this.laticinio,
      mesReferencia: this.mesReferencia,
      precoLeite: this.precoLeite,
      producaoLitros: this.producaoLitros,
      ccs: this.ccs,
      cbt: this.cbt,
      gordura: this.gordura,
      proteina: this.proteina,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('CadastroParametros', cadastroParametrosSchema)

export const schema = model.schema
export default model
