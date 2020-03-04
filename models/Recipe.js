const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./Review');

const RecipeSchema = new Schema ({
    name: String,
    description: String,
    calories: String,
    cookingTime: String,
    image: String,
    link: String,
    ingredients: [String],
    category: [String],
    reviews: [Review.schema], // embedding reviews in recipe
},
{timestamps: true});


const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports = Recipe;
