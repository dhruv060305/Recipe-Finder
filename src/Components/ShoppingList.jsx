import React, { useState } from 'react';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  const addItem = () => {
    if (input.trim()) {
      setItems([...items, { name: input.trim(), bought: false }]);
      setInput('');
    }
  };

  const toggleBought = (index) => {
    const updated = [...items];
    updated[index].bought = !updated[index].bought;
    setItems(updated);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const downloadList = () => {
    if (items.length === 0) return;

    const content = items
      .map((item, index) => `${index + 1}. ${item.name} ${item.bought ? '(✔)' : ''}`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex justify-center items-start pt-12 px-4">
      <div className="w-full max-w-3xl bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-6">🛒 Shopping List</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Add ingredient..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={addItem}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              Add
            </button>
            <button
              onClick={downloadList}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Download
            </button>
          </div>
        </div>

        <ul className="space-y-2">
          {items.length === 0 && (
            <li className="text-center text-gray-400">No items added yet.</li>
          )}
          {items.map((item, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-3 rounded-lg border border-gray-700 ${
                item.bought
                  ? 'bg-green-800 text-white'
                  : 'bg-gray-800 text-white'
              }`}
            >
              <span
                onClick={() => toggleBought(index)}
                className={`cursor-pointer flex-grow ${
                  item.bought ? 'line-through opacity-70' : ''
                }`}
              >
                {item.name}
              </span>
              <button
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShoppingList;
