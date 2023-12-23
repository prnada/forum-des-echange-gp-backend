const mongoose = require("mongoose");
const Schema = mongoose.Schema;

 
const MydataSchema = new Schema({
    name : String,
   email : String,
   password : String
   
  },
  { timestamps: true }
  );
   

// Create a model based on that schema
const UserModel = mongoose.model("users", MydataSchema);

// export the model
module.exports = UserModel;