import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  return (
    <div className="flex items-center text-yellow-500">
      {[...Array(fullStars)].map((_, i) => <span key={i}>★</span>)}
      {halfStar && <span>☆</span>}
      {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => <span key={i + 5}>☆</span>)}
    </div>
  );
};

const RecipeTable = () => {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({ title: '', cuisine: '', rating: '' });
  const [drawerData, setDrawerData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    const query = new URLSearchParams({
      page,
      limit,
      ...(filters.title && { title: filters.title }),
      ...(filters.cuisine && { cuisine: filters.cuisine }),
      ...(filters.rating && { rating: filters.rating }),
    });

    const res = await fetch(`http://localhost:3000/api/recipes/search?${query}`);
    const data = await res.json();
    setRecipes(data.data);
    setTotal(data.total || 0);
  };

  useEffect(() => { fetchData(); }, [filters, page, limit]);

  const handleFilterChange = (field, value) => {
    setPage(1);
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-4">
        <input className="border px-2 py-1 rounded" placeholder="Title" value={filters.title} onChange={e => handleFilterChange('title', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Cuisine" value={filters.cuisine} onChange={e => handleFilterChange('cuisine', e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="Rating >=" value={filters.rating.replace('>=', '')} onChange={e => handleFilterChange('rating', `>=${e.target.value}`)} />
        <select className="border px-2 py-1 rounded" value={limit} onChange={e => setLimit(Number(e.target.value))}>
          {[15, 20, 30, 40, 50].map(num => <option key={num} value={num}>{num}/page</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Cuisine</th>
              <th className="p-2 text-left">Rating</th>
              <th className="p-2 text-left">Total Time</th>
              <th className="p-2 text-left">Serves</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((r, i) => (
              <tr key={i} className="border-t cursor-pointer hover:bg-gray-50" onClick={() => setDrawerData(r)}>
                <td className="p-2 truncate max-w-[250px]" title={r.title}>{r.title}</td>
                <td className="p-2">{r.cuisine}</td>
                <td className="p-2"><StarRating rating={r.rating} /></td>
                <td className="p-2">{r.total_time} min</td>
                <td className="p-2">{r.serves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drawerData && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto z-50">
          <button className="absolute top-2 right-2 text-gray-500" onClick={() => setDrawerData(null)}>✕</button>
          <h2 className="text-xl font-bold">{drawerData.title} - {drawerData.cuisine}</h2>
          <p className="mt-2"><strong>Description:</strong> {drawerData.description}</p>
          <div className="mt-2">
            <strong>Total Time:</strong> {drawerData.total_time} min
            <button onClick={() => setExpanded(!expanded)} className="ml-2 text-blue-500"><ChevronDown className={`inline w-4 h-4 transition ${expanded ? 'rotate-180' : ''}`} /></button>
            {expanded && (
              <ul className="ml-6 mt-1 list-disc text-sm">
                <li>Prep Time: {drawerData.prep_time} min</li>
                <li>Cook Time: {drawerData.cook_time} min</li>
              </ul>
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Nutrition</h3>
            <table className="table-auto border w-full text-sm">
              <thead><tr className="bg-gray-100">
                <th className="border p-1">Type</th>
                <th className="border p-1">Value</th>
              </tr></thead>
              <tbody>
                {['calories','carbohydrateContent','cholesterolContent','fiberContent','proteinContent','saturatedFatContent','sodiumContent','sugarContent','fatContent'].map(key => (
                  <tr key={key}>
                    <td className="border p-1 capitalize">{key.replace(/Content$/, '')}</td>
                    <td className="border p-1">{drawerData.nutrients?.[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-gray-200 rounded">Previous</button>
        <span>Page {page}</span>
        <button disabled={recipes.length < limit} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-gray-200 rounded">Next</button>
      </div>
    </div>
  );
};

export default RecipeTable;
