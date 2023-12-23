const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//collection categories
const categorieSchema = Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
    personne: { type: mongoose.Schema.Types.ObjectId, ref: 'Personne', required: true }
  }, { timestamps: true });
  
//
const categorieModel = mongoose.model('Categorie', categorieSchema);

module.exports=categorieModel;