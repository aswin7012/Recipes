import React, { useEffect, useState } from 'react';
import RecipeRow from './components/RecipeRow';
import RecipeDrawer from './components/RecipeDrawer';

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
      Object.entries(filters).filter(([, v]) => v !== '')
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
                <RecipeRow
                  key={idx}
                  recipe={recipe}
                  onClick={handleRowClick}
                />
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
      <RecipeDrawer
        recipe={selectedRecipe}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        expandedTime={expandedTime}
        setExpandedTime={setExpandedTime}
      />
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
