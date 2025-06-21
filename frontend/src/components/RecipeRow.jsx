import React from 'react';
import StarRating from './StarRating';

const RecipeRow = ({ recipe, onClick }) => (
  <tr
    className="border-t cursor-pointer hover:bg-gray-50"
    onClick={() => onClick(recipe)}
  >
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
);

export default RecipeRow;