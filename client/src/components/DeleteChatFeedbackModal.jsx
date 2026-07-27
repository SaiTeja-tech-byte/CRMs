import React, { useState } from 'react';

const REASONS = [
  "No longer needed",
  "Conversation created by mistake",
  "Duplicate conversation",
  "Inactive conversation",
  "Inappropriate or irrelevant content",
  "Other"
];

const DeleteChatFeedbackModal = ({ isOpen, chatType, targetName, currentUser, onClose, onConfirmDelete }) => {
  const [step, setStep] = useState(1);
  const [feedbackReason, setFeedbackReason] = useState("");
  const [feedbackComments, setFeedbackComments] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state when closing
    setStep(1);
    setFeedbackReason("");
    setFeedbackComments("");
    setIsDeleting(false);
    onClose();
  };

  const handleContinue = () => {
    setStep(2);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const feedbackData = {
      feedbackType: "chat_deletion",
      chatType: chatType, // 'individual' or 'group'
      reason: feedbackReason,
      comments: feedbackComments,
      deletedBy: currentUser?.id,
      deletedByRole: currentUser?.role?.toLowerCase() === "admin" ? "admin" : "employee",
      createdAt: new Date().toISOString()
    };
    
    // onConfirmDelete is responsible for calling the API and returning true/false
    const success = await onConfirmDelete(feedbackData);
    if (success) {
      handleClose();
    } else {
      setIsDeleting(false);
      handleClose();
    }
  };

  if (step === 1) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}
        onClick={handleClose}
      >
        <div className="bg-white rounded-3 shadow p-4 d-flex flex-column" style={{ width: "450px" }} onClick={(e) => e.stopPropagation()}>
          <h5 className="fw-bold mb-2">Before You Delete</h5>
          <p className="text-muted small mb-4">Please tell us why you are deleting this conversation. Your feedback helps us improve the communication experience.</p>
          
          <div className="mb-4">
            <div className="fw-medium small mb-2">Why are you deleting this conversation?</div>
            <div className="d-flex flex-column gap-2">
              {REASONS.map(reason => (
                <label key={reason} className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                  <input 
                    type="radio" 
                    name="deleteFeedbackReason"
                    className="form-check-input mt-0"
                    value={reason}
                    checked={feedbackReason === reason}
                    onChange={(e) => setFeedbackReason(e.target.value)}
                  />
                  <span className="small">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="fw-medium small mb-2">Additional Feedback (Optional)</div>
            <textarea 
              className="form-control text-sm" 
              rows="2"
              placeholder="Tell us more about your reason..."
              value={feedbackComments}
              onChange={(e) => setFeedbackComments(e.target.value)}
              style={{ fontSize: "13px" }}
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-auto">
            <button type="button" className="btn btn-light border" onClick={handleClose}>Cancel</button>
            <button 
              type="button" 
              className="btn btn-brand" 
              disabled={!feedbackReason || (feedbackReason === "Other" && !feedbackComments.trim())}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Final Confirmation
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}
      onClick={handleClose}
    >
      <div className="bg-white rounded-3 shadow p-4 d-flex flex-column" style={{ width: "400px" }} onClick={(e) => e.stopPropagation()}>
        <h5 className="fw-bold mb-3">{chatType === 'group' ? 'Delete Group?' : 'Delete Conversation?'}</h5>
        <p className="mb-2">This {chatType === 'group' ? 'group and its conversation' : 'conversation'} will be permanently deleted.</p>
        <p className="text-muted small mb-4">This action cannot be undone.</p>
        <div className="d-flex justify-content-end gap-2 mt-auto">
          <button type="button" className="btn btn-light border" onClick={() => setStep(1)} disabled={isDeleting}>Back</button>
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatFeedbackModal;
