//BlogDetail.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const BlogDetail = () => {
  // Get the blog post ID from the URL parameters
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        setErrorMessage("");

        const response = await api.get(`/posts/${id}`);
        if (!response.data) {
          setNotFound(true);
        } else {
          setPost(response.data);
        }
      } catch (err) {
        console.error("Error fetching blog detail:", err);
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        } else {
          setErrorMessage("An error occurred while loading the blog post.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  // Helper: estimate reading time safely
  const getReadingTime = (text) => {
    if (!text || typeof text !== "string") return 1;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);
    return Math.max(1, minutes);
  };

  // Helper: get initial letter for avatar safely
  const getInitial = (name) => {
    return name && typeof name === "string" ? name.charAt(0).toUpperCase() : "?";
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Loading blog details...</span>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="not-found-container">
        <h2>⚠️ Blog not found</h2>
        <p>The blog post you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn btn-primary back-btn">
          ← Back to All Posts
        </Link>
      </div>
    );
  }

  // 3. Other Error state
  if (errorMessage) {
    return (
      <div className="not-found-container">
        <p className="error-message">{errorMessage}</p>
        <Link to="/" className="btn btn-primary back-btn">
          ← Back to All Posts
        </Link>
      </div>
    );
  }

  // 4. Success state: Display full blog details
  const blogContent = post.content || post.body || "";
  const readingTime = getReadingTime(blogContent);

  return (
    <div className="blog-detail-page">
      <Link to="/" className="back-link">
        ← Back to Posts
      </Link>

      <article className="blog-detail-card">
        {/* Full Blog Title */}
        <h1 className="blog-detail-title">{post.title}</h1>

        {/* Blog Metadata (Author & Date) */}
        <div className="blog-detail-meta">
          <div className="author-info">
            <span className="author-detail-avatar">
              {getInitial(post.author?.name)}
            </span>
            <div className="author-text">
              <span className="author-name">
                {post.author?.name || "Author"}
              </span>
              {post.author?.email && (
                <span className="author-email">({post.author.email})</span>
              )}
            </div>
          </div>
          <div>
            <span className="reading-time">
              📅 {new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              ⏱ {readingTime} min read
            </span>
          </div>
        </div>

        <hr className="divider" />

        {/* Complete Blog Content */}
        <div className="blog-detail-content">{blogContent}</div>
      </article>
    </div>
  );
};

export default BlogDetail;
