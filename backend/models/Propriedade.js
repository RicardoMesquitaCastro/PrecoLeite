const mongoose = require("mongoose");

const PropriedadeSchema = new mongoose.Schema(
  {
    propriedade: { type: String, required: true },
    municipio: { type: String, required: true },
    regiao: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Propriedade", PropriedadeSchema);
