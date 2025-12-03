import React, { useState, useEffect } from "react";
import "./Post.css";
import PostsList from "./PostsList";

// changed: use Query service as canonical source
const API_URL = "http://localhost:5004/posts";
const POSTS_URL = "http://localhost:5001/posts";
// COMMENTS_API not needed when Query returns posts with comments
// const COMMENTS_API = "http://localhost:5002/posts";

const Post = () => {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);

  // Fetch posts from Query service (single request; Query holds comments)
  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      // Query returns an object map (id -> post); convert to array
      const postsArray = Array.isArray(data) ? data : Object.values(data || {});
      setPosts(postsArray);
    } catch (err) {
      console.error("Failed to fetch posts from Query service:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add a new post — still posts to posts service (server creates event)
  const addPost = async () => {
    if (!text.trim()) return;

    try {
      const res = await fetch(POSTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (res.ok) {
        // optimistic update: append to UI immediately
        setPosts((prev) => [...prev, data]);
        setText("");
        console.log("posting a post");
      } else {
        console.error("Error adding post:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Reset all posts (frontend clears immediately; server clears posts service)
  const resetPosts = async () => {
    setPosts([]); // clear frontend immediately
    try {
      await fetch(POSTS_URL, { method: "DELETE" });
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
