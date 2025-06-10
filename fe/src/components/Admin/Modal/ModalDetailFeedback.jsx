import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './ModalDetailFeedback.css';

export default function ModalDetailFeedback({
  show,
  handleClose,
  feedback = {},
  handleMarkAsResolved
}) {
  if (!show) return null;

  return (
    <div className="mdf-overlay" onClick={handleClose}>
      <div className="mdf-container" onClick={e => e.stopPropagation()}>
        <div className="mdf-header">
          <h4>Chi tiết phản hồi</h4>
          <button className="mdf-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="mdf-body">
          <div className="mdf-field">
            <span className="mdf-label">Hội viên:</span>
            <span className="mdf-value">{feedback.memberName}</span>
          </div>
          <div className="mdf-field">
            <span className="mdf-label">Ngày gửi:</span>
            <span className="mdf-value">{feedback.date}</span>
          </div>
          <div className="mdf-field">
            <span className="mdf-label">Loại phản hồi:</span>
            <span className="mdf-value">{feedback.type}</span>
          </div>
          <div className="mdf-field">
            <span className="mdf-label">Nội dung:</span>
            <span className="mdf-value">{feedback.content}</span>
          </div>
          <div className="mdf-field">
            <span className="mdf-label">Trạng thái:</span>
            <span className="mdf-value">{feedback.status}</span>
          </div>
        </div>

        <div className="mdf-footer">
          {feedback.status === "Chưa xử lý" && (
            <button
              className="mdf-btn mdf-btn-primary"
              onClick={() => handleMarkAsResolved(feedback.id)}
            >
              Đánh dấu đã xử lý
            </button>
          )}
          <button
            className="mdf-btn mdf-btn-secondary"
            onClick={handleClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
