import React from "react";
import "./CommentsList.css";

const CommentsList = ({ comments }) => {
  return (
    <div className="comments-list">
      {(comments || []).map((comment) => (
        <div key={comment.id} className="comment">
          <p>{comment.status === "rejected" ? "Comment rejected" : comment.text}</p>
          {comment.status === "pending" && <span className="badge pending">Pending</span>}
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
