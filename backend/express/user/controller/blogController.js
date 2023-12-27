const Blog = require("../model/blogModel");
const User = require("../model/userModel");

const blogController = {
  //Add Blog
  addBlog: async (req, res) => {
    try {
      const { name, description } = req.body;
      const image = req.file;
      const newBlog = new Blog({
        name,
        description,
        image: image.path,
      });
      await newBlog.save();
      console.log("New Blog:", newBlog);
      res
        .status(201)
        .json({ success: true, message: "Add New Blog Successfully", newBlog });
    } catch (error) {
      console.error("Error adding blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //View all Blog
  getBlog: async (req, res) => {
    try {
      let search = req.query.search || "";
      let blogs;
      blogs = await Blog.find({ name: { $regex: search, $options: "i" } });
      return res.status(200).json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

// Get Blog By Id
  getBlogById: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const blog = await Blog.findById(blogId);

      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      const likes = await Promise.all(blog.likes.map(async (userId) => {
        const user = await User.findById(userId);
        return { name: user.name, _id: user._id }; 
      }));
      const comments = await Promise.all(blog.comments.map(async (comment) => {
        const user = await User.findById(comment.user);
        return {
          user: { name: user.name, _id: user._id }, 
          text: comment.text
        };
      }));
      const blogWithDetails = {
        _id: blog._id,
        name: blog.name || '',
        description: blog.description,
        image: blog.image,
        likes: likes,
        comments: comments,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      };
      res.status(200).json(blogWithDetails);
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Edit Blog by ID
  editBlog: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const { name, description } = req.body;
      const image = req.file;
      const updatedBlog = {name, description,};
      if (image) {
        updatedBlog.image = image.path;
      }
      const result = await  Blog.findByIdAndUpdate({_id:blogId}, updatedBlog, {
        new: true,
      });
      res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        updatedBlog: result,
      });
    } catch (error) {
      console.error("Error editing blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Delete Blog by ID
  deleteBlog: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      await Blog.findByIdAndDelete(blogId);
      
      res.status(200).json({
        success: true,
        message: "blog deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


 // Like Blog by ID
  likeBlog: async (req, res) => {
    try {
      console.log('req.user:', req.user);
      const userId = req.decoded.userId;
      if (!userId) {
        return res.status(400).send("User ID is missing in the request.");
      }
      const blogId = req.params.blogId;
      const blog = await Blog.findById(blogId);

      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      const likedIndex = blog.likes.indexOf(userId);
      if (likedIndex === -1) {
        blog.likes.push(userId);
      } else {
        blog.likes.splice(likedIndex, 1);
      }
      await blog.save();
      res.status(200).json({ success: true, message: 'Blog like status updated successfully' });
    } catch (error) {
      console.error('Error updating blog like status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Comment on Blog by ID
  commentBlog: async (req, res) => {
    try {
      const blogId = req.params.blogId;
      const userId = req.decoded.userId;

      const { text } = req.body;

      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      const user = await User.findById(userId);
      blog.comments.push({ user: userId, text }); 
      await blog.save();
      {console.log('userId:', userId)}
      res.status(200).json({ success: true, message: 'Comment added successfully' });
    } catch (error) {
      console.error('Error commenting on blog:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Edit Comment by Blog ID and Comment ID
  editComment: async (req, res) => {
    try {
      const { blogId, editedCommentId } = req.params;
      const userId = req.decoded.userId;

      const { text } = req.body;

      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      const comment = blog.comments.id(editedCommentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      if (comment.user.toString() !== userId) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      comment.text = text;
      await blog.save();

      res.status(200).json({ success: true, message: 'Comment updated successfully' });
    } catch (error) {
      console.error('Error editing comment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Delete Comment by Blog ID and Comment ID
  deleteComment: async (req, res) => {
    try {
      const { blogId, editedCommentId } = req.params;
      const userId = req.decoded.userId;

      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      const comment = blog.comments.id(editedCommentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      if (comment.user.toString() !== userId) {
        return res.status(403).json({ error: 'Permission denied' });
      }
      comment.remove();
      await blog.save();
      res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },


};

module.exports = blogController;