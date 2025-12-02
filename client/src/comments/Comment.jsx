import React, { useState } from "react";
import "./Comment.css";

const Comment = ({ postId, onAddComment }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment(postId, text);
    setText("");
    console.log("comment posted")
  };

  return (
    <div className="add-comment">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button onClick={handleSubmit}>Comment</button>
    </div>
  );
};

export default Comment;
