const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//collection categories
const categorieSchema = Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
     
  }, { timestamps: true });
  
//
const categorieModel = mongoose.model('categories', categorieSchema);

module.exports=categorieModel;