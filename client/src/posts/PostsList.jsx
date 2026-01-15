import React from "react";
import "./PostsList.css";
import CommentsList from "../comments/CommentsList";
import CommentForm from "../comments/Comment";

const API_URL = "http://blog.local/posts"; // use Query service via ingress

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
        // Refetch from Query after a short delay to get moderated status
        setTimeout(async () => {
          try {
            const refreshRes = await fetch(API_URL);
            const updatedPosts = await refreshRes.json();
            const postsArray = Array.isArray(updatedPosts)
              ? updatedPosts
              : Object.values(updatedPosts || {});
            setPosts(postsArray);
          } catch (err) {
            console.error("Failed to refetch posts:", err);
          }
        }, 500); // wait 500ms for moderation to complete
      } else {
        console.error("Error adding comment:", data && data.error);
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
          <CommentsList comments={post.comments || []} />
          <CommentForm postId={post.id} onAddComment={addComment} />
        </div>
      ))}
    </div>
  );
};

export default PostsList;
