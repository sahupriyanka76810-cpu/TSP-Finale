//Home.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Home = () => {
  // State to store all posts
  const [posts, setPosts] = useState([]);
  // State to store loading status
  const [loading, setLoading] = useState(true);
  // State for editing a post
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Get the logged-in user's ID from localStorage
  const userId = localStorage.getItem("userId");

  // ====================================
  // FETCH ALL POSTS
  // useEffect runs once when the component loads.
  // ====================================
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty array = run only once

  // ====================================
  // DELETE A POST
  // ====================================
  const handleDelete = async (postId) => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      // Remove the deleted post from state (updates the UI)
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting post");
    }
  };

  // ====================================
  // START EDITING A POST
  // ====================================
  const startEdit = (post) => {
    setEditingId(post._id);
    setEditTitle(post.title || "");
    setEditContent(post.content || post.body || "");
  };

  // ====================================
  // CANCEL EDITING
  // ====================================
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  // ====================================
  // SAVE EDITED POST
  // ====================================
  const handleUpdate = async (postId) => {
    try {
      const response = await api.put(`/posts/${postId}`, {
        title: editTitle,
        content: editContent,
      });
      // Update the post in state with the new data
      setPosts(
        posts.map((post) => (post._id === postId ? response.data : post))
      );
      cancelEdit();
    } catch (error) {
      alert(error.response?.data?.message || "Error updating post");
    }
  };

  // Helper: get initial letter for avatar safely
  const getInitial = (name) => {
    return name && typeof name === "string" ? name.charAt(0).toUpperCase() : "?";
  };

  // Show loading message while fetching
  if (loading)
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Loading posts...</span>
      </div>
    );

  return (
    <div className="home">
      {/* Hero / Header */}
      <div className="home-header">
        <h1>
          Discover <span className="gradient-text">Stories</span> That Matter
        </h1>
        <p>Read, write, and share your ideas with the world</p>
      </div>

      {/* Show message if no posts exist */}
      {posts.length === 0 ? (
        <p className="no-posts">No posts yet. Be the first to create one!</p>
      ) : (
        <div className="posts-list">
          {posts.map((post) => {
            const rawContent = post.content || post.body || "";
            return (
              <div key={post._id} className="post-card">
                {editingId === post._id ? (
                  // ---- EDIT MODE ----
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="edit-input"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="edit-textarea"
                    />
                    <div className="edit-buttons">
                      <button
                        onClick={() => handleUpdate(post._id)}
                        className="btn btn-save"
                      >
                        ✓ Save
                      </button>
                      <button onClick={cancelEdit} className="btn btn-cancel">
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // ---- VIEW MODE ----
                  <>
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-content">{rawContent}</p>
                    <div className="post-meta">
                      <div className="post-meta-author">
                        <span className="author-avatar">
                          {getInitial(post.author?.name)}
                        </span>
                        <span>{post.author?.name || "Author"}</span>
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
                      <Link to={`/blogs/${post._id}`} className="btn btn-read-more">
                        Read More →
                      </Link>

                      {/* Show Edit/Delete buttons only if the logged-in user is the author */}
                      {userId && post.author?._id === userId && (
                        <>
                          <button
                            onClick={() => startEdit(post)}
                            className="btn btn-edit"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="btn btn-delete"
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
