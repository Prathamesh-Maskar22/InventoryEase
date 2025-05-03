import React from 'react'
import backgroundImage from '../assets/upload-files.png';  // Import the image here

export default function About() {
  return (
    <div className="h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container mx-auto px-4 py-10 bg-white shadow-md rounded-lg max-w-4xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 border-b-2 pb-2">
          Inventory Management System - MERN CRUD App
        </h1>
        <p className="text-gray-700 text-lg mb-4 leading-relaxed">
          Hello! I'm <span className="font-semibold text-blue-600">Prathamesh Maskar</span>, a passionate Full Stack Web Developer with hands-on experience in building scalable web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js).
        </p>
        <p className="text-gray-700 text-lg mb-4 leading-relaxed">
          This mini project, an Inventory Management System, is a demonstration of my understanding of full-stack development, including frontend interfaces, backend APIs, database integration, and CRUD operations.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          Through this project, I aimed to showcase my ability to create responsive UIs, manage application state, handle form validations, and structure secure RESTful APIs — all using modern web technologies. This project serves as a practical example of my journey and growth as a developer.
        </p>
      </div>
    </div>

  )
}
