import React from 'react';
import NutritionTable from './NutritionTable';

const RecipeDrawer = ({
  recipe,
  open,
  onClose,
  expandedTime,
  setExpandedTime,
}) => {
  if (!open || !recipe) return null;
  return (
    <div
      className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 border-l border-gray-200 transition-all"
      style={{ animation: 'slideIn 0.2s' }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <div className="text-lg font-bold">{recipe.title}</div>
          <div className="text-gray-500">{recipe.cuisine}</div>
        </div>
        <button
          className="text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span className="font-semibold">Description:</span>{' '}
          <span>{recipe.description || 'N/A'}</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold">Total Time:</span>{' '}
          <span>{recipe.total_time} min</span>
          <button
            className="ml-2 text-blue-500"
            onClick={() => setExpandedTime(e => !e)}
            aria-label="Expand"
          >
            {expandedTime ? '▲' : '▼'}
          </button>
          {expandedTime && (
            <div className="ml-4 mt-1 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Cook Time:</span>{' '}
                {recipe.cook_time || 'N/A'} min
              </div>
              <div>
                <span className="font-semibold">Prep Time:</span>{' '}
                {recipe.prep_time || 'N/A'} min
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="font-semibold mb-1">Nutrition</div>
          <NutritionTable nutrition={recipe.nutrition} />
        </div>
      </div>
    </div>
  );
};

export default RecipeDrawer;