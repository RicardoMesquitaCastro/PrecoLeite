import mongoose, { Schema } from 'mongoose';

const cadastroContaSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; }
  }
});

// Métodos
cadastroContaSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
    return full ? { ...view } : view;
  }
};

// ⚠️ PREVENÇÃO DE OVERWRITE DO MODELO
export const CadastroConta =
  mongoose.models.CadastroConta || mongoose.model('CadastroConta', cadastroContaSchema);

// Exportação correta do schema
export const schema = CadastroConta.schema;

export default CadastroConta;
