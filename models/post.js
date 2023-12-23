const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// collection posts
const postSchema =  Schema({
    date: { type: Date, default: Date.now },
    titre: { type: String, required: true },
    contenu: { type: String, required: true },
    personne: [{ 
      type: mongoose.Schema.Types.ObjectId,
       ref: 'Personne', required: true 
  }]
  }, { timestamps: true }); 
  
  // 
  const postModel = mongoose.model('Post', postSchema);

  module.exports=postModel;