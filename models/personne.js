const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//colletion personnes 
const personneSchema =Schema({
  nom:  String ,
  prenom:  String ,
  email: String , 
  role: String,
  age:  Number ,
  
  pays:  String ,
 
  password: String ,
posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categorie'}],
commentaires: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commentaire' }]
}, { timestamps: true });  

// 
const personneModel = mongoose.model('personnes', personneSchema);




module.exports = personneModel;