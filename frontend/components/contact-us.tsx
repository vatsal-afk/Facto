// components/ContactUs.tsx
import React, { useState } from "react";
import emailjs from "emailjs-com";

const ContactUs: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    emailjs
      .send(
        "service_mminu19", // EmailJS service ID
        "template_e3i8bvf", // EmailJS template ID
        templateParams,
        "hGi-_GY4XU7EbgXUq" // Your EmailJS user ID
      )
      .then(
        (response) => {
          console.log("Message sent:", response);
          setStatus("Message sent successfully!");
        },
        (error) => {
          console.log("Error sending message:", error);
          setStatus("Failed to send message.");
        }
      );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Contact Us</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 font-semibold">
              Your Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600"
          >
            Send Message
          </button>
        </form>

        {status && <p className="mt-4 text-center text-green-600">{status}</p>}
      </div>
    </div>
  );
};

export default ContactUs;
