import mongoose, { Schema } from 'mongoose';

const cadastroContaSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; }
  }
});

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

// ✅ Export nomeado
export const CadastroConta = mongoose.model('CadastroConta', cadastroContaSchema);
export const schema = CadastroConta.schema;
