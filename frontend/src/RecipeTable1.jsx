import React, { useEffect, useState } from 'react';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i}>★</span>
      ))}
      {halfStar && <span>☆</span>}
      {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
        <span key={i + 5}>☆</span>
      ))}
    </div>
  );
};

const RecipeTable = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/recipes')
      .then(res => res.json())
      .then(data => setRecipes(data.data || data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Recipes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2 w-1/3">Title</th>
              <th className="text-left p-2">Cuisine</th>
              <th className="text-left p-2">Rating</th>
              <th className="text-left p-2">Total Time (min)</th>
              <th className="text-left p-2">Serves</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2 truncate max-w-[250px]" title={recipe.title}>
                  {recipe.title}
                </td>
                <td className="p-2">{recipe.cuisine}</td>
                <td className="p-2">
                  <StarRating rating={recipe.rating} />
                </td>
                <td className="p-2">{recipe.total_time} min</td>
                <td className="p-2">{recipe.serves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeTable;
