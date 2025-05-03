import React from 'react'

export default function Navbar(props) {
  return (
    <header className="bg-[#169976] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Title */}
          <div className="flex-shrink-0">
            <a href="/" className="text-white text-2xl font-bold">
              {props.title}
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-lg">
            <a href="/products" className="hover:text-gray-300">Products</a>
            <a href="/about" className="hover:text-gray-300">About</a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search"
              className="px-3 py-1 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white font-medium">
              Search
            </button>
          </div>

          {/* Mobile Menu (optional if you want responsiveness) */}
          <div className="md:hidden">
            {/* You can add a hamburger menu here if needed */}
          </div>
        </div>
      </div>
    </header>
  )
}
