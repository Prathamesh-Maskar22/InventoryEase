import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import backgroundImage from '../assets/upload-files.png';  // Import the image here

export default function Products() {

  useEffect(() => {
    getProducts();
  }, [])

  const [productData, setProductData] = useState([]);

  const getProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (res.status === 201) {
        console.log("Data Retrieved.");
        setProductData(data);
      } else {
        console.log("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const deleteProduct = async (id) => {
    const response = await fetch(`http://localhost:3001/deleteproduct/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const deletedata = await response.json();
    console.log(deletedata);

    if (response.status === 422 || !deletedata) {
      console.log("Error");
    } else {
      console.log("Product deleted");
      getProducts();
    }
  }

  return (
    <div className="h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Products Inventory</h1>
          <NavLink to="/insertproduct" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-lg font-medium shadow">
            + Add New Product
          </NavLink>
        </div>

        <div className="overflow-x-auto max-h-[38rem] border border-gray-200 rounded-md shadow-md">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-900 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Product Price</th>
                <th className="px-4 py-3">Product Barcode</th>
                <th className="px-4 py-3">Update</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-gray-50">
              {productData.map((element, id) => (
                <tr key={element._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{id + 1}</td>
                  <td className="px-4 py-3">{element.ProductName}</td>
                  <td className="px-4 py-3">₹{element.ProductPrice}</td>
                  <td className="px-4 py-3">{element.ProductBarcode}</td>
                  <td className="px-4 py-3">
                    <NavLink to={`/updateproduct/${element._id}`} className="text-blue-600 hover:text-blue-800 text-xl">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </NavLink>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteProduct(element._id)} className="text-red-600 hover:text-red-800 text-xl">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
