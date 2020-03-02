const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./Review');

const RecipeSchema = new Schema ({
    name: String,
    description: String,
    calories: Number,
    method: String,
    cookingTime: String,
    image: String,
    link: String,
},
{timestamps: true});


const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports = Recipe;
