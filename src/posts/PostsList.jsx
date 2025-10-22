import React from "react";
import CommentsList from "../comments/CommentsList";
import CommentForm from "../comments/Comment"; 
import "./PostsList.css";

const API_URL = "http://localhost:5002/posts";

const PostsList = ({ posts, setPosts }) => {
  const addComment = async (postId, text) => {
    try {
      const res = await fetch(`${API_URL}/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (res.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, comments: [...post.comments, data] }
              : post
          )
        );
      } else {
        console.error("Error adding comment:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <p className="post-text">{post.text}</p>
          <CommentsList comments={post.comments} />
          <CommentForm postId={post.id} onAddComment={addComment} />
        </div>
      ))}
    </div>
  );
};

export default PostsList;
