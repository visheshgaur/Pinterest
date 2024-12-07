const mongoose = require('mongoose');
const passport = require('passport');
const plm=require("passport-local-mongoose");
const { none } = require('./multer');
mongoose.connect("mongodb+srv://vishesh:<db_password>@cluster0.srgqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log("connected")
})
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true
    
  },
  
  password: {
    type: String,
   
  },
  posts: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
  }],
  dp: {
    type: String
   
  },
  email:{
type:String,
required:true,
unique:true
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
})
userSchema.plugin(plm)
// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
