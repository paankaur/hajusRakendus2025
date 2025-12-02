import React from "react";
import "./CommentsList.css";

const CommentsList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <div className="no-comments">No comments yet.</div>;
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-card">
          {comment.text}
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
