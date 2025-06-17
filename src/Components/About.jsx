import React from 'react'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center text-purple-700">About Recipe Finder</h1>
      <p className="text-gray-700 text-lg mb-4">
        <strong>Recipe Finder</strong> is a user-friendly React application designed to help you quickly find delicious recipes based on the ingredients you have and the type of dish you want to prepare.
      </p>

      <p className="text-gray-700 text-lg mb-4">
        Using the <strong>TheMealDB</strong> API, you can explore a variety of recipes, filter them by cuisine, dietary preferences, or cook time, and even save your favorites for later viewing.
      </p>

     

      <p className="text-gray-700 text-lg">
        Whether you're a home cook or just exploring new ideas, Recipe Finder makes it easy to cook something amazing with what you have!
      </p>
    </div>
  )
}
