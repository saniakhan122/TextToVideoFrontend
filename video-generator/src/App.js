import React, { useState } from "react";

const VideoGenerator = () => {
  const [topic, setTopic] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const generateVideo = async () => {
    setLoading(true);
    setError("");
    setVideoUrl("");

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (response.ok) {
        setTimeout(async () => {
          const videoResponse = await fetch("http://127.0.0.1:5000/generated_video");
          if (videoResponse.ok) {
            setVideoUrl("http://127.0.0.1:5000/generated_video");
          } else {
            setError("Failed to retrieve the generated video.");
          }
        }, 5000);
      } else {
        const errorText = await response.text();
        setError(errorText || "Failed to generate video.");
      }
    } catch (err) {
      setError("An error occurred while generating the video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Video Generator</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          margin: "20px 0",
        }}
      >
        <textarea
          value={topic}
          onChange={handleTopicChange}
          placeholder="Enter a detailed topic or article here..."
          style={{
            padding: "10px",
            width: "90%",
            height: "200px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            resize: "vertical",
            lineHeight: "1.5",
          }}
        />
        <button
          onClick={generateVideo}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate Video"}
        </button>
      </div>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {videoUrl && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>Generated Video</h2>
          <video src={videoUrl} controls width="1920" height="1080" />
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
