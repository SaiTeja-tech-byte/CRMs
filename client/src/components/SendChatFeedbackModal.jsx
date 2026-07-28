import React, { useState } from 'react';

const CATEGORIES = [
  "Messaging experience",
  "Notifications",
  "Group chat",
  "Performance / speed",
  "UI / usability",
  "Report an issue",
  "Other"
];

const SendChatFeedbackModal = ({ isOpen, onClose, chatType, conversationId, onSubmit }) => {
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setCategory("");
    setRating(0);
    setComments("");
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || rating === 0) return;

    setIsSubmitting(true);
    const success = await onSubmit({
      feedbackType: 'chat_experience',
      reason: category, // Using reason field to store the selected category
      rating: rating,
      comments: comments,
      chatType: chatType,
      conversationId: conversationId
    });

    if (success) {
      handleClose();
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-3 shadow p-4 d-flex flex-column" 
        style={{ width: "450px", maxHeight: "90vh", overflowY: "auto" }} 
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="fw-bold mb-1">Send Feedback</h5>
        <p className="text-muted small mb-4">Help us improve the chat experience.</p>
        
        <form onSubmit={handleSubmit} className="d-flex flex-column h-100">
          <div className="mb-4">
            <div className="fw-medium small mb-2">What would you like to give feedback about?</div>
            <div className="d-flex flex-column gap-2">
              {CATEGORIES.map(cat => (
                <label key={cat} className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                  <input 
                    type="radio" 
                    name="feedbackCategory"
                    className="form-check-input mt-0"
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                  <span className="small">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="fw-medium small mb-2">How would you rate your experience?</div>
            <div className="d-flex gap-2">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  type="button"
                  className={`btn rounded-circle d-flex align-items-center justify-content-center ${rating === num ? 'btn-primary text-white' : 'btn-light border'}`}
                  style={{ width: "40px", height: "40px", fontWeight: "600" }}
                  onClick={() => setRating(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="fw-medium small mb-2">Additional comments (Optional)</div>
            <textarea 
              className="form-control text-sm" 
              rows="3"
              placeholder="Tell us more about your experience..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              style={{ fontSize: "13px" }}
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-auto pt-3 border-top">
            <button type="button" className="btn btn-light border" onClick={handleClose} disabled={isSubmitting}>Cancel</button>
            <button 
              type="submit" 
              className="btn btn-brand" 
              disabled={!category || rating === 0 || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendChatFeedbackModal;
