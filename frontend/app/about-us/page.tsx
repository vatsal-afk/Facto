'use client';

export default function AboutPage() {
  const developers = [
    {
      name: "Vatsal",
      role: "Developer",
      image: "/image.png", // Replace with actual image path
      linkedin: "https://www.linkedin.com/in/vatsal-agarwal-b67315280/",
      github: "https://github.com/vatsal-afk",
    },
    {
      name: "Tanmay",
      role: "Developer",
      image: "/image.png", // Replace with actual image path
      linkedin: "https://www.linkedin.com/in/tanmay-sharma-bb8799280/",
      github: "https://github.com/cypher4802",
    },
    {
      name: "Vishesh",
      role: "Data Analyst",
      image: "/image.png", // Replace with actual image path
      linkedin: "https://www.linkedin.com/in/vishesh-bhardwaj-1773bb222/",
      github: "https://github.com/MaSsKmAn",
    },
    {
      name: "Aman",
      role: "Data Analyst",
      image: "/image.png", // Replace with actual image path
      linkedin: "https://www.linkedin.com/in/aman-yadav-aa79b1282/",
      github: "https://github.com/AmanYadav000",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
      <p className="text-xl text-center mb-10">
        "We are a team of four passionate developers, each bringing unique skills to create impactful solutions. Together, we strive for excellence and innovation."
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {developers.map((dev, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={dev.image}
              alt={dev.name}
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{dev.name}</h2>
            <p className="text-gray-600 mb-4">{dev.role}</p>
            <div className="flex justify-center space-x-4">
              <a
                href={dev.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                LinkedIn
              </a>
              <a
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-900"
              >
                GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}