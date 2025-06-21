import React from 'react';

const fields = [
  { label: 'Calories', key: 'calories' },
  { label: 'Carbohydrates', key: 'carbohydrateContent' },
  { label: 'Cholesterol', key: 'cholesterolContent' },
  { label: 'Fiber', key: 'fiberContent' },
  { label: 'Protein', key: 'proteinContent' },
  { label: 'Saturated Fat', key: 'saturatedFatContent' },
  { label: 'Sodium', key: 'sodiumContent' },
  { label: 'Sugar', key: 'sugarContent' },
  { label: 'Fat', key: 'fatContent' },
];

const NutritionTable = ({ nutrition }) => (
  <table className="w-full text-sm border">
    <tbody>
      {fields.map(({ label, key }) => (
        <tr key={key}>
          <td className="border px-2 py-1">{label}</td>
          <td className="border px-2 py-1">{nutrition?.[key] || 'N/A'}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default NutritionTable;