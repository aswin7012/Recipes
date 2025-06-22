const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db.js");
const Recipe = require("./schema.js");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Welcome to the Recipe API");
});
app.get("/api/recipes", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Recipe.countDocuments();
    const recipes = await Recipe.find()
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);

    const formatted = recipes.map((recipe, index) => ({
      id: skip + index + 1,
      title: recipe.title,
      cuisine: recipe.cuisine,
      rating: recipe.rating,
      prep_time: recipe.prep_time,
      cook_time: recipe.cook_time,
      total_time: recipe.total_time,
      description: recipe.description,
      nutrients: recipe.nutrients,
      serves: recipe.serves,
    }));

    res.json({
      page,
      limit,
      total,
      data: formatted,
    });
  } catch (err) {
    console.error("Error fetching recipes:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

const parseNumericFilter = (str) => {
  const match = str.match(/(<=|>=|=|<|>)(\d+(\.\d+)?)/);
  if (!match) return null;
  const [, op, num] = match;
  const value = parseFloat(num);
  const operatorMap = {
    ">": "$gt",
    "<": "$lt",
    ">=": "$gte",
    "<=": "$lte",
    "=": "$eq",
  };
  return { [operatorMap[op]]: value };
};

app.get("/api/recipes/search", async (req, res) => {
  try {
    const { title, cuisine, rating, total_time, calories } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (cuisine) {
      filter.cuisine = { $regex: cuisine, $options: "i" };
    }
    if (rating) {
      const ratingFilter = parseNumericFilter(rating);
      if (ratingFilter) filter.rating = ratingFilter;
    }
    if (total_time) {
      const timeFilter = parseNumericFilter(total_time);
      if (timeFilter) filter.total_time = timeFilter;
    }
    if (calories) {
      const calFilter = parseNumericFilter(calories);
      if (calFilter) {
        const [mongoOp, targetVal] = Object.entries(calFilter)[0];

        filter.$expr = {
          [mongoOp]: [
            {
              $toDouble: {
                $arrayElemAt: [{ $split: ["$nutrients.calories", " "] }, 0],
              },
            },
            targetVal,
          ],
        };
      }
    }

    await connectDB();
    console.log("Connected to MongoDB");
    console.log("Search filter:", filter);
    const skip = (page - 1) * limit;
    const total = await Recipe.countDocuments(filter);
    const recipes = await Recipe.find(filter).skip(skip).limit(limit);
    const formatted = recipes.map((recipe, index) => ({
      id: index + 1,
      title: recipe.title,
      cuisine: recipe.cuisine,
      rating: recipe.rating,
      prep_time: recipe.prep_time,
      cook_time: recipe.cook_time,
      total_time: recipe.total_time,
      description: recipe.description,
      nutrients: recipe.nutrients,
      serves: recipe.serves,
    }));
    res.json({ total: total, data: formatted });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 3000;
