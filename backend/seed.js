const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./schema.js');
const connectDB = require('./db.js');
dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    const rawData = fs.readFileSync("US_recipes_null.json", 'utf8');
    const jsonData = JSON.parse(rawData);
    const recipes = Object.values(jsonData);
    await Recipe.deleteMany();
    await Recipe.insertMany(recipes);
    console.log(`✅ Seeded ${recipes.length} recipes to the database.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
