// const mongoose = require("mongoose");

// // Har section ka structure
// const sectionSchema = new mongoose.Schema({
//   heading: {
//     type: String,
//     required: true,
//     trim: true,
//     default: "Untitled Section"  // agar heading na diya jaye to default
//   },
//   content: {
//     type: String,
//     required: true,
//     trim: true
//   }
// });

// const postSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ["published", "draft"],
//     default: "published"
//   },
//   image: {
//     type: String,
//     default: ""
//   },
//   sections: [sectionSchema],  // Ab yeh array hai sections ka
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Optional: Index for better performance
// postSchema.index({ category: 1 });
// postSchema.index({ createdAt: -1 });

// module.exports = mongoose.model("Post", postSchema);


const mongoose = require("mongoose");

// Har section ka structure
const sectionSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true,
    default: "Untitled Section"
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  shortDesc: {  // ← NEW FIELD: Short description for home page previews
    type: String,
    required: false,
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["published", "draft"],
    default: "published"
  },
  image: {
    type: String,
    default: ""
  },
  sections: [sectionSchema],  // Main detailed sections (article page ke liye)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

postSchema.index({ category: 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);