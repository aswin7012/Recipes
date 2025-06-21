import React, { useEffect, useState } from 'react';

// Star rating component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  return (
    <div className="flex items-center text-yellow-500">
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

const defaultFilters = {
  title: '',
  cuisine: '',
  rating: '',
  total_time: '',
  serves: '',
};

const resultsPerPageOptions = [15, 20, 30, 40, 50];

const RecipeTable = () => {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedTime, setExpandedTime] = useState(false);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(15);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNoData(false);
    setNoResults(false);

    const hasFilters = Object.values(filters).some(v => v !== '');

    const filteredParams = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );

    const query = new URLSearchParams({
      ...filteredParams,
      page,
      limit: resultsPerPage,
    }).toString();

    const url = hasFilters
      ? `http://localhost:3000/api/recipes/search?${query}`
      : `http://localhost:3000/api/recipes?page=${page}&limit=${resultsPerPage}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const arr = data.data || data.recipes || data;
        setRecipes(Array.isArray(arr) ? arr : []);
        setTotalResults(data.total || arr.length || 0);
        setNoData(!arr || arr.length === 0);
        setNoResults(hasFilters && (!arr || arr.length === 0));
      })
      .catch(() => setNoData(true))
      .finally(() => setLoading(false));
  }, [filters, page, resultsPerPage]);

  const handleFilterChange = (field, value) => {
    let newValue = value;
    if ((field === 'rating' || field === 'total_time') && value && !/^[<>]=?|=/.test(value)) {
      newValue = '=' + value;
    }
    setFilters(f => ({ ...f, [field]: newValue }));
    setPage(1);
  };

  const handleRowClick = recipe => {
    setSelectedRecipe(recipe);
    setDrawerOpen(true);
    setExpandedTime(false);
  };

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="p-6 relative">
      <h2 className="text-xl font-bold mb-4">Recipes</h2>
      <div className="mb-2 flex items-center gap-4">
        <span>Results per page:</span>
        <select
          value={resultsPerPage}
          onChange={e => {
            setResultsPerPage(Number(e.target.value));
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          {resultsPerPageOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2 w-1/3">
                <input
                  className="w-full border rounded px-1 py-0.5 mb-1"
                  placeholder="Filter Title"
                  value={filters.title}
                  onChange={e => handleFilterChange('title', e.target.value)}
                />
                Title
              </th>
              <th className="text-left p-2">
                <input
                  className="w-full border rounded px-1 py-0.5 mb-1"
                  placeholder="Filter Cuisine"
                  value={filters.cuisine}
                  onChange={e => handleFilterChange('cuisine', e.target.value)}
                />
                Cuisine
              </th>
              <th className="text-left p-2">
                <input
                  className="w-full border rounded px-1 py-0.5 mb-1"
                  placeholder="Filter Rating"
                  type="text" 
                  value={filters.rating}
                  onChange={e => handleFilterChange('rating', e.target.value)}
                />
                Rating
              </th>
              <th className="text-left p-2">
                <input
                  className="w-full border rounded px-1 py-0.5 mb-1"
                  placeholder="Filter Total Time"
                  type="text"
                  pattern="^[<>]=?|=?\d*$"
                  value={filters.total_time}
                  onChange={e => handleFilterChange('total_time', e.target.value)}
                />
                Total Time (min)
              </th>
              <th className="text-left p-2">
                <input
                  className="w-full border rounded px-1 py-0.5 mb-1"
                  placeholder="Filter Serves"
                  type="number"
                  min="1"
                  value={filters.serves}
                  onChange={e => handleFilterChange('serves', e.target.value)}
                />
                Serves
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-8">Loading...</td>
              </tr>
            ) : noData ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-500">
                  {noResults
                    ? 'No results found for your search.'
                    : 'No recipes found.'}
                </td>
              </tr>
            ) : (
              recipes.map((recipe, idx) => (
                <tr
                  key={idx}
                  className="border-t cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(recipe)}
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
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 items-center">
          <button
            className="px-2 py-1 border rounded"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="px-2 py-1 border rounded"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
      {drawerOpen && selectedRecipe && (
        <div
          className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 border-l border-gray-200 transition-all"
          style={{ animation: 'slideIn 0.2s' }}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <div>
              <div className="text-lg font-bold">{selectedRecipe.title}</div>
              <div className="text-gray-500">{selectedRecipe.cuisine}</div>
            </div>
            <button
              className="text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="p-4">
            <div className="mb-2">
              <span className="font-semibold">Description:</span>{' '}
              <span>{selectedRecipe.description || 'N/A'}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total Time:</span>{' '}
              <span>{selectedRecipe.total_time} min</span>
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
                    {selectedRecipe.cook_time || 'N/A'} min
                  </div>
                  <div>
                    <span className="font-semibold">Prep Time:</span>{' '}
                    {selectedRecipe.prep_time || 'N/A'} min
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="font-semibold mb-1">Nutrition</div>
              <table className="w-full text-sm border">
                <tbody>
                  <tr>
                    <td className="border px-2 py-1">Calories</td>
                    <td className="border px-2 py-1">{selectedRecipe.nutrition?.calories || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Carbohydrates</td>
                    <td className="border px-2 py-1">{selectedRecipe.nutrition?.carbohydrateContent || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Cholesterol</td>
                    <td className="border px-2 py-1">{selectedRecipe.nutrition?.cholesterolContent || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Fiber</td>
                    <td className="border px-2 py-1">{selectedRecipe.nutrition?.fiberContent || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Protein</td>
                    <td className="border px-2 py-1">{selectedRecipe.nutrition?.proteinContent || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Saturated Fat</td>
                    <td className="border px-2 py-1">{selectedRecipe.nutrition?.saturatedFatContent || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Sodium</td>
                    <td className="border px-2 py-1">{selectedRecipe.nutrition?.sodiumContent || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Sugar</td>
                    <td className="border px-2 py-1">{selectedRecipe.nutrition?.sugarContent || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Fat</td>
                    <td className="border px-2 py-1">{selectedRecipe.nutrition?.fatContent || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <style>
        {`
          @keyframes slideIn {
            from { right: -400px; }
            to { right: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default RecipeTable;
