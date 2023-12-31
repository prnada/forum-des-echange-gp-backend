const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//collection commentaires
const commentaireSchema = Schema({
  contenu: { type: String, required: true },
  personne: { type: mongoose.Schema.Types.ObjectId, ref: 'Personne', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
}, { timestamps: true });


//
const commentaireModel = mongoose.model('commentaires', commentaireSchema);

module.exports = commentaireModel;