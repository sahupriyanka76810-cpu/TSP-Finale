//CreatePost.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreatePost = () => {
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // Error, success, loading state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send the new post data to the backend
      await api.post("/posts", { title, content });

      // Redirect to home page to see the new post
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Error creating post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-card">
        <h2>✍️ Create New Post</h2>

        {/* Show error message if post creation fails */}
        {error && <p className="error-message">⚠ {error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Give your post a great title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              placeholder="Write your story here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              required
            />
            <div className="char-count">{content.length} characters</div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
