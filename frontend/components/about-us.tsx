// components/AboutUs.tsx
"use client";

import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">About Us</h1>

      {/* About the project/organization */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <p className="text-lg text-gray-700 mb-4">
          We are a team of developers committed to bringing transparency to news
          and media. Our goal is to make it easier for people to verify news
          content and gain insights into social media trends. This platform
          allows users to input news articles, analyze trends, and ensure that
          information is accurate and up to date.
        </p>
        <p className="text-lg text-gray-700">
          Our team consists of developers, designers, and data scientists who
          collaborate to build and maintain this platform. Together, we work
          towards a future where misinformation is minimized and the truth is
          accessible to everyone.
        </p>
      </div>

      {/* About the developers section */}
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Meet the Developers</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Developer 1 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img
            src="/developer1.jpg" // Replace with your actual image path
            alt="Developer 1"
            className="w-full h-48 object-cover rounded-t-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800">Developer 1</h3>
          <p className="text-gray-600">Frontend Developer</p>
          <p className="text-gray-700 mt-2">
            Passionate about creating seamless user experiences and making
            data-driven applications.
          </p>
        </div>

        {/* Developer 2 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img
            src="/developer2.jpg" // Replace with your actual image path
            alt="Developer 2"
            className="w-full h-48 object-cover rounded-t-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800">Developer 2</h3>
          <p className="text-gray-600">Backend Developer</p>
          <p className="text-gray-700 mt-2">
            Focused on building robust server-side applications and APIs.
          </p>
        </div>

        {/* Developer 3 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img
            src="/developer3.jpg" // Replace with your actual image path
            alt="Developer 3"
            className="w-full h-48 object-cover rounded-t-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800">Developer 3</h3>
          <p className="text-gray-600">Data Scientist</p>
          <p className="text-gray-700 mt-2">
            Enthusiastic about machine learning and data-driven decision
            making.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
