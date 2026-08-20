//App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import MyBlogs from "./pages/MyBlogs";
import BlogDetail from "./pages/BlogDetail";

const App = () => {
  return (
    // Router wraps our entire app to enable client-side routing
    <Router>
      {/* Navbar appears on every page */}
      <Navbar />

      {/* Main content area */}
      <div className="container">
        <Routes>
          {/* Define all the routes (URL → Component) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/my-blogs" element={<MyBlogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
