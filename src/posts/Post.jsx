import React, { useState, useEffect } from "react";
import "./Post.css";
import PostsList from "./PostsList";

const API_URL = "http://localhost:5000/posts";

const Post = () => {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);
  

  // Fetch posts from server
  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      // Ensure every post has a comments array
      const normalized = data.map((post) => ({
        ...post,
        comments: post.comments || [],
      }));
      setPosts(normalized);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add a new post
  const addPost = async () => {
    if (!text.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => [...prev, data]);
        setText("");
      } else {
        console.error("Error adding post:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
  // Reset all posts
  const resetPosts = async () => {
    setPosts([]); // clear frontend immediately
    try {
      await fetch(API_URL, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to reset posts:", err);
    }
  };

  return (
    <div className="post-container">
      {/* Add Post */}
      <div className="add-post-card">
        <h2>Add a Post</h2>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something..."
          onKeyDown={(e) => {
            if (e.key === "Enter") addPost();
          }}
        />
        <button onClick={addPost}>Submit</button>
        <button onClick={resetPosts} className="reset-btn">
          Reset
        </button>
      </div>

      <PostsList posts={posts} setPosts={setPosts} />
   
    </div>
  );
};

export default Post;
