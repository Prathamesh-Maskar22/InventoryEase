import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/upload-files.png';  // Import the image here

export default function InsertProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState();
  const [productBarcode, setProductBarcode] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const setName = (e) => setProductName(e.target.value);
  const setPrice = (e) => setProductPrice(e.target.value);
  const setBarcode = (e) => {
    const value = e.target.value.slice(0, 12);
    setProductBarcode(value);
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !productBarcode) {
      setError("*Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3001/insertproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ProductName: productName,
          ProductPrice: productPrice,
          ProductBarcode: productBarcode
        })
      });

      await res.json();

      if (res.status === 201) {
        alert("Data Inserted");
        setProductName("");
        setProductPrice("");
        setProductBarcode("");
        navigate('/products');
      } else if (res.status === 422) {
        alert("Product is already added with that barcode.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Enter Product Information</h1>

      <form onSubmit={addProduct} className="space-y-6">
        <div>
          <label htmlFor="product_name" className="block text-lg font-semibold text-gray-700 mb-2">Product Name</label>
          <input
            type="text"
            id="product_name"
            value={productName}
            onChange={setName}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Enter Product Name"
            required
          />
        </div>

        <div>
          <label htmlFor="product_price" className="block text-lg font-semibold text-gray-700 mb-2">Product Price</label>
          <input
            type="number"
            id="product_price"
            value={productPrice}
            onChange={setPrice}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Enter Product Price"
            required
          />
        </div>

        <div>
          <label htmlFor="product_barcode" className="block text-lg font-semibold text-gray-700 mb-2">Product Barcode</label>
          <input
            type="number"
            id="product_barcode"
            value={productBarcode}
            onChange={setBarcode}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Enter Product Barcode"
            required
          />
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <NavLink to="/products" className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded text-lg">Cancel</NavLink>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg" disabled={loading}>
            {loading ? 'Inserting...' : 'Insert'}
          </button>
        </div>

        {error && <p className="text-center text-red-600 font-semibold mt-4">{error}</p>}
      </form>
    </div>
    </div>
  )
}
