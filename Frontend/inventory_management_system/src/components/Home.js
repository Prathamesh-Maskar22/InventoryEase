import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Chart from 'chart.js/auto'; // Chart.js import
import backgroundImage from '../assets/upload-files.png'; // Background image

export default function Home() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [recentProducts, setRecentProducts] = useState([]);
  const [priceData, setPriceData] = useState({ labels: [], counts: [] });
  const [priceSegments, setPriceSegments] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Color palette for charts
  const colors = {
    blue: 'rgba(37, 99, 235, 0.6)',
    green: 'rgba(34, 197, 94, 0.6)',
    purple: 'rgba(147, 51, 234, 0.6)',
    blueBorder: 'rgba(37, 99, 235, 1)',
    greenBorder: 'rgba(34, 197, 94, 1)',
    purpleBorder: 'rgba(147, 51, 234, 1)',
  };

  // Fetch product data and prepare chart data
  useEffect(() => {
    const getProductStats = async () => {
      try {
        const res = await fetch('http://localhost:3001/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (res.status === 201) {
          // Total products
          setTotalProducts(data.length);

          // Recent products (top 3)
          setRecentProducts(data.slice(0, 3));

          // Prepare price distribution data (Histogram)
          const prices = data.map((product) => parseFloat(product.ProductPrice)).sort((a, b) => a - b);
          const bins = [0, 100, 200, 300, 400, 500, Infinity];
          const labels = bins.slice(0, -1).map((bin, i) => {
            if (bins[i + 1] === Infinity) return `${bin}+`;
            return `${bin}-${bins[i + 1]}`;
          });
          const counts = bins.slice(0, -1).map((bin, i) => {
            const nextBin = bins[i + 1];
            return prices.filter(
              (price) => price >= bin && (nextBin === Infinity || price < nextBin)
            ).length;
          });
          setPriceData({ labels, counts });

          // Prepare price segments data (Doughnut Chart)
          const segments = [
            { label: 'Low (<₹100)', count: prices.filter((p) => p < 100).length, color: colors.blue, border: colors.blueBorder },
            { label: 'Medium (₹100-300)', count: prices.filter((p) => p >= 100 && p < 300).length, color: colors.green, border: colors.greenBorder },
            { label: 'High (>₹300)', count: prices.filter((p) => p >= 300).length, color: colors.purple, border: colors.purpleBorder },
          ].filter((seg) => seg.count > 0); // Remove empty segments
          setPriceSegments(segments);

          // Prepare scatter data (Scatter Chart)
          const scatterPoints = data.map((product, index) => ({
            x: parseFloat(product.ProductPrice),
            y: 1 + Math.random() * 0.5, // Slight vertical jitter for visibility
            productName: product.ProductName,
          }));
          setScatterData(scatterPoints);

          // Render Histogram
          const histogramCanvas = document.getElementById('priceChart');
          if (histogramCanvas) {
            new Chart(histogramCanvas.getContext('2d'), {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [
                  {
                    label: 'Number of Products',
                    data: counts,
                    backgroundColor: colors.blue,
                    borderColor: colors.blueBorder,
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { title: { display: true, text: 'Price Range (₹)', font: { size: 14 } } },
                  y: {
                    title: { display: true, text: 'Number of Products', font: { size: 14 } },
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                  },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', cornerRadius: 8 },
                },
              },
            });
          }

          // Render Doughnut Chart
          const doughnutCanvas = document.getElementById('priceSegmentsChart');
          if (doughnutCanvas) {
            new Chart(doughnutCanvas.getContext('2d'), {
              type: 'doughnut',
              data: {
                labels: segments.map((seg) => seg.label),
                datasets: [
                  {
                    data: segments.map((seg) => seg.count),
                    backgroundColor: segments.map((seg) => seg.color),
                    borderColor: segments.map((seg) => seg.border),
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%', // Increase for a thinner doughnut
                plugins: {
                  legend: { position: 'bottom', labels: { font: { size: 12 } } },
                  tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', cornerRadius: 8 },
                },
              },
            });
          }

          // Render Scatter Chart
          const scatterCanvas = document.getElementById('priceScatterChart');
          if (scatterCanvas) {
            new Chart(scatterCanvas.getContext('2d'), {
              type: 'scatter',
              data: {
                datasets: [
                  {
                    label: 'Product Prices',
                    data: scatterPoints,
                    backgroundColor: colors.purple,
                    borderColor: colors.purpleBorder,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { title: { display: true, text: 'Price (₹)', font: { size: 14 } } },
                  y: {
                    title: { display: false }, // Hide y-axis title
                    min: 0,
                    max: 2,
                    ticks: { display: false }, // Hide y-axis ticks
                  },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    cornerRadius: 8,
                    callbacks: {
                      label: (context) => {
                        const point = scatterPoints[context.dataIndex];
                        return `${point.productName}: ₹${point.x}`;
                      },
                    },
                  },
                },
              },
            });
          }
        } else {
          setError('Failed to load product data.');
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getProductStats();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="p-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Product Inventory Management
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Effortlessly manage your product inventory with our intuitive and powerful system.
          </p>
          <div className="flex justify-center gap-4">
            <NavLink
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium shadow-md transition duration-300"
            >
              View Products
            </NavLink>
            <NavLink
              to="/insertproduct"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg font-medium shadow-md transition duration-300"
            >
              Add New Product
            </NavLink>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md mb-12 border border-gray-100 animate-fade-in">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inventory Overview</h2>
          {loading ? (
            <p className="text-gray-600">Loading stats...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="flex justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
                <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
              </div>
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* Price Distribution Histogram */}
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Price Distribution</h2>
            {loading ? (
              <p className="text-gray-600">Loading chart...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <div className="relative h-80">
                <canvas id="priceChart"></canvas>
              </div>
            )}
          </div>

          {/* Price Segments Doughnut Chart */}
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Price Segments</h2>
            {loading ? (
              <p className="text-gray-600">Loading chart...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <div className="relative h-80">
                <canvas id="priceSegmentsChart"></canvas>
              </div>
            )}
          </div>

          {/* Price Scatter Chart */}
          {/* <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md border border-gray-100 animate-fade-in sm:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Individual Product Prices</h2>
            {loading ? (
              <p className="text-gray-600">Loading chart...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <div className="relative h-80">
                <canvas id="priceScatterChart"></canvas>
              </div>
            )}
          </div> */}
        </div>

        {/* Recent Products Section */}
        {recentProducts.length > 0 && (
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recently Added Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-900">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Product Price</th>
                    <th className="px-4 py-3">Product Barcode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentProducts.map((product, index) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{product.ProductName}</td>
                      <td className="px-4 py-3">₹{product.ProductPrice}</td>
                      <td className="px-4 py-3">{product.ProductBarcode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}