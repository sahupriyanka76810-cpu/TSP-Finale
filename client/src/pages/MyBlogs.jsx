//MyBlogs.jsx

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const MyBlogs = () => {
  // State to store user's posts
  const [posts, setPosts] = useState([]);
  // State to handle loading indicator
  const [loading, setLoading] = useState(true);
  // State to handle errors
  const [error, setError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    const fetchMyPosts = async () => {
      try {
        const response = await api.get("/posts/my-posts");
        setPosts(response.data || []);
      } catch (err) {
        console.error("Error fetching my posts:", err);
        setError("Failed to fetch your posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [navigate]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      // Remove deleted post from state
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting post");
    }
  };

  // Helper: get initial letter for avatar safely
  const getInitial = (name) => {
    return name && typeof name === "string" ? name.charAt(0).toUpperCase() : "?";
  };

  // Show loading message while fetching data
  if (loading)
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Loading your blogs...</span>
      </div>
    );

  return (
    <div className="my-blogs-page">
      <h1 className="page-title">My Blogs</h1>
      <p className="page-subtitle">Manage and view all your published posts</p>

      {/* Show error if fetching failed */}
      {error && <p className="error-message">⚠ {error}</p>}

      {/* Post count badge */}
      {posts.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <span className="post-count-badge">
            📝 <strong>{posts.length}</strong> {posts.length === 1 ? "post" : "posts"} published
          </span>
        </div>
      )}

      {/* Show message if user has created no posts yet */}
      {posts.length === 0 ? (
        <div className="no-posts-container">
          <span className="empty-state-icon">📝</span>
          <p className="no-posts">You haven't created any blog posts yet.</p>
          <Link to="/create" className="btn btn-primary create-link-btn">
            ✍️ Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => {
            const rawContent = post.content || post.body || "";
            // Short content preview (max 120 characters)
            const contentPreview =
              rawContent.length > 120
                ? rawContent.substring(0, 120) + "..."
                : rawContent;

            return (
              <div key={post._id} className="post-card">
                <h2 className="post-title">{post.title}</h2>

                {/* Short Content Preview */}
                <p className="post-preview">{contentPreview}</p>

                <div className="post-meta">
                  <div className="post-meta-author">
                    <span className="author-avatar small">
                      {getInitial(post.author?.name)}
                    </span>
                    <span>{post.author?.name || "You"}</span>
                  </div>
                  <span>
                    {new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="post-actions">
                  {/* Read More button linking to full Blog Detail page */}
                  <Link to={`/blogs/${post._id}`} className="btn btn-read-more">
                    Read More →
                  </Link>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="btn btn-delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
