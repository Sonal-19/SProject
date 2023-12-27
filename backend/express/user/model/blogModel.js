const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
    },
  ],
},
{ timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
