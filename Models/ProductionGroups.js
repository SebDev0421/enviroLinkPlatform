const mongoose = require('mongoose');

const ProductionGroupSchema = new mongoose.Schema({
  name: String,
  farmId:String,
  minProduction: { type: Number, required: true },
  maxProduction: { type: Number, required: true },
  food: { type: Number, default: 0 }, // Cantidad de alimento asignado al grupo
  // otros campos...
});

const ProductionGroup = mongoose.model('ProductionGroup', ProductionGroupSchema);

module.exports = ProductionGroup;