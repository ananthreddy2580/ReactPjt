import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    purpose: "",
  });
  const API_URL = import.meta.env.VITE_API_URL; // Read from .env

  const [message, setMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Fetch CSRF token when the app loads
    axios
      .get(`${API_URL}/api/get-csrf-token/`, { withCredentials: true })
      .then((response) => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error("Error fetching CSRF token:", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/visitors/`, formData, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // Include CSRF token
        },
        withCredentials: true, // Important for sending cookies
      });
      console.log("Response:", response.data);
      setFormData({ name: "", email: "", purpose: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="form-container">
        <h2>Visitor Form</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="purpose"
            placeholder="Purpose of visit"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default App;
