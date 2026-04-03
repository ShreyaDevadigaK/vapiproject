import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_API_KEY = "6LeCmYgrAAAAACifMP3KUp2Wjk6n83GZOLcqfEt4";

export default function ContactForm() {
  const [captchaValue, setCaptchaValue] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, captcha: captchaValue }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
        setCaptchaValue(null);
      } else {
        alert(data.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-r from-cyan-700 to-cyan-400 text-white rounded-lg p-8 mt-10 shadow-lg">
      <h2 className="text-3xl font-bold mb-6">Drop us a line</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Name"
            className="bg-transparent border-b border-white outline-none py-2 px-1 placeholder-white"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="bg-transparent border-b border-white outline-none py-2 px-1 placeholder-white"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="text"
            placeholder="Phone"
            className="bg-transparent border-b border-white outline-none py-2 px-1 placeholder-white"
          />
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="bg-transparent border-b border-white outline-none py-2 px-1 text-white"
          >
            <option className="text-black" value="">
              Select one...
            </option>
            <option className="text-black" value="Software Testing">
              Software Testing
            </option>
            <option className="text-black" value="Human Resources">
              Human Resources
            </option>
            <option className="text-black" value="Vendor Management">
              Vendor Management
            </option>
            <option className="text-black" value="Media & Marketing">
              Media & Marketing
            </option>
          </select>
        </div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message"
          className="w-full bg-transparent border-b border-white outline-none py-2 px-1 placeholder-white resize-none"
          rows="4"
        ></textarea>
        <div>
          <ReCAPTCHA sitekey={SITE_API_KEY} onChange={handleCaptchaChange} />
        </div>
        <button
          type="submit"
          className="w-full bg-white text-cyan-600 font-semibold py-2 rounded hover:bg-gray-100 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
