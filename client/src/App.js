import React, { useState } from "react";
import "./App.css";

function App() {
  const [fullUrl, setFullUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullUrl }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setShortUrl(data.shortUrl);
      } else {
        console.error("Failed to shorten URL");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="url-shortener-container">
      <h1 className="url-shortener-h1">URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Full URL:
          <input
            placeholder="&#x1F58A;"
            type="url"
            value={fullUrl}
            onChange={(e) => setFullUrl(e.target.value)}
            required
          />
        </label>
        <button className="url-shortener-button" type="submit">
          Get Shorten URL
        </button>
      </form>
      {shortUrl && (
        <div className="shortened-url-container">
          <p>Shortened URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
