const mongoose = require('mongoose');

// Define the schema
const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  image:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  likes: {
    type: Array,
    default: [], 
  },
}); 
// Create the model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
