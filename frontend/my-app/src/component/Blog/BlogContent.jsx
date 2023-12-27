import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHeart } from "@fortawesome/free-solid-svg-icons";
import './Blog.css';

export default function BlogContent() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [commentText, setCommentText] = useState(" ");
  const [editedCommentId, setEditedCommentId] = useState(null);
  const { blogId } = useParams();
  const userId = "user_id"; 


 const fetchBlogDetails = useCallback(async () => {
  try {
    const response = await axios.get(
      `http://localhost:3059/users/api/getBlogById/${blogId}`
    );
    setSelectedBlog(response.data);
  } catch (error) {
    console.error("Error fetching Blog details:", error.message);
  }
  }, [blogId]);

  useEffect(() => {
    const fetchDetailsAndSetBlog = async () => {
      await fetchBlogDetails();
    };
    fetchDetailsAndSetBlog();
  }, [blogId, fetchBlogDetails]);

   // Like a blog
  const handleLike = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:3059/users/api/like/${blogId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update blog details after liking
      fetchBlogDetails();
    } catch (error) {
      console.error('Error liking blog:', error.message);
    }
  };

  // Add or edit a comment
  const handleComment = async () => {
    const token = localStorage.getItem('token');
    try {
      if (editedCommentId === null) {
        await axios.post(`http://localhost:3059/users/api/comment/${blogId}`, { text: commentText }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.put(
          `http://localhost:3059/users/api/editComment/${blogId}/${editedCommentId}`,
          { text: commentText },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEditedCommentId(null);
      }
    fetchBlogDetails();
    setCommentText("");
  } catch (error) {
    console.error('Error commenting on blog:', error.message);
  }
};

  // Edit an existing comment
  const handleEditComment = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:3059/users/api/editComment/${blogId}/${editedCommentId}`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBlogDetails();
      setCommentText("");
      setEditedCommentId(null);
    } catch (error) {
      console.error('Error editing comment:', error.message);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `http://localhost:3059/users/api/deleteComment/${blogId}/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBlogDetails();
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };

  // Start editing a comment
  const handleStartEdit = (commentId, commentText) => {
    setEditedCommentId(commentId);
    setCommentText(commentText);
  };

  return (
    <>
      {selectedBlog && (
        <div className="container d-flex flex-column align-items-center mt-4">
          <div className="cardAP rounded bg-white border shadow p-4 pb-5 mb-5">
            <div className="d-flex justify-content-end">
              <Link to="/userblog" className="btn btn-light">
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
            </div>
            <div className="container d-flex">
              <div className="row g-3">
                <div className="col-12 text-center">
                  <img
                    src={`http://localhost:3059/${selectedBlog.image}`}
                    alt={`${selectedBlog.name}'s Profile`}
                    className="ms-2 card-img-top BeerListItem-imgB"
                  />
                </div>
                <div className="col-12 text-center">
                  <div>
                    <h2 className="m-4 mb-2 mt-0">{selectedBlog.name}</h2>
                  </div>
                </div>
                <div className="col-12 text-center">
                  <div className="ms-4" style={{ fontStyle: "italic" }}>
                    {selectedBlog.description}
                  </div>
                </div>
                <div className="col-12 text-center">
                  <div className="ms-4">
                    {/* Like Button */}
                    <button className="btn btn-outline-white me-2" onClick={handleLike}>
                      <FontAwesomeIcon icon={faHeart} className="heart-white"/>
                    </button>
                    {/* Display Likes */}
                    <span className="me-2">
                      Likes: {selectedBlog.likes.length}
                    </span>
                    {/* Comment Section */}
                    <div className="mt-3 ms-4">
                      <div className="ms-5 ps-5">
                        <textarea
                          className="form-control card w-75"
                          placeholder="Add a comment..."
                          onChange={(e) => setCommentText(e.target.value)}
                          value={commentText}
                        ></textarea>
                      </div>
                      {editedCommentId === null ? (
                        <button
                          className="btn btn-secondary mt-2"
                          onClick={handleComment}
                        >
                          Comment
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary mt-2"
                          onClick={handleEditComment}
                        >
                          Save Edit
                        </button>
                      )}
                    </div>
                    {/* Display Comments */}
                    <div className="mt-3 ms-5">
                    {selectedBlog.comments.map((comment) => (
                      <div key={comment._id}>
                        {/* Add console.log statements here */}
                        {console.log('comment.user._id:', comment.user._id, typeof comment.user._id)}
                        {console.log('userId:', userId, typeof userId)}
                        {console.log('Comparison result:', comment.user._id === userId)}

                        <p className="ms-5 ps-5 card w-75 text-secondary pb-1" style={{ fontStyle: "italic" }}>
                          <strong>@{comment.user.name}</strong> {comment.text}
                          {comment.user._id.toString() === userId && (
                            <span>
                              {/* Edit Button */}
                              <button
                                className="btn btn-secondary"
                                onClick={() => handleStartEdit(comment._id, comment.text)}
                                disabled={editedCommentId !== null}
                              >
                                Edit
                              </button>
                              {/* Delete Button */}
                              <button
                                className="btn btn-danger text-danger"
                                onClick={() => handleDeleteComment(comment._id)}
                                disabled={editedCommentId !== null}
                              >
                                Delete
                              </button>
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
