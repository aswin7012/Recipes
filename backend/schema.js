const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  cuisine: {
    type: String,
   // required: true,
  },
  title: {
    type: String,
   // required: true,
  },
  rating: {
    type: Number,
   // default: 0,
  },
  prep_time: {
    type: Number,
   // required: true,
  },
  cook_time: {
    type: Number,
    //required: true,
  },
  total_time: {
    type: Number,
    //required: true,
  },
  description: {
    type: String,
  },
  nutrients: {
    type: Object, // Equivalent to JSONB in SQL
    default: {},
  },
  serves: {
    type: String,
   // required: true,
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Recipe', recipeSchema);
