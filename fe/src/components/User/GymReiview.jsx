import React, { useState, useEffect } from 'react';
import './GymReview.css';
import { submitFeedback, getFeedbacksByTarget, getAllUsers } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { CgGym } from "react-icons/cg";
import { FaUserGraduate } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";

const GymReview = () => {
  const { user } = useAuth();
  const [activeReviewType, setActiveReviewType] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await getAllUsers();
        if (usersRes.success) {
          const allUsers = usersRes.users || usersRes.data || [];
          setTrainers(allUsers.filter((u) => u.role === 'coach'));
          setStaff(allUsers.filter((u) => u.role === 'staff'));
        }
        await fetchRecentReviews();
      } catch (err) {
        setError('Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchRecentReviews = async () => {
  try {
    const gymReviews = await getFeedbacksByTarget('GYM');
    const staffReviews = await getFeedbacksByTarget('STAFF');
    const trainerReviews = await getFeedbacksByTarget('TRAINER');
    const allReviews = [
      ...(gymReviews.feedbacks || []).map((fb) => ({
        id: fb._id,
        type: 'gym',
        userName: fb.user?.name,
        rating: fb.rating,
        comment: fb.message,
        createdAt: fb.createdAt,  // <-- thêm createdAt để sort
      })),
      ...(staffReviews.feedbacks || []).map((fb) => ({
        id: fb._id,
        type: 'staff',
        userName: fb.user?.name,
        rating: fb.rating,
        comment: fb.message,
        createdAt: fb.createdAt,
      })),
      ...(trainerReviews.feedbacks || []).map((fb) => ({
        id: fb._id,
        type: 'trainer',
        userName: fb.user?.name,
        rating: fb.rating,
        comment: fb.message,
        createdAt: fb.createdAt,
      })),
    ];

    // Sort giảm dần theo thời gian
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setRecentReviews(allReviews.slice(0, 10));
  } catch {}
};


  const handleSubmit = async () => {
    if (rating === 0 || !reviewText.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    const currentUser = user || authService.getCurrentUser();
    const data = {
      userId: currentUser._id,
      rating,
      message: reviewText,
      target: activeReviewType.toUpperCase(),
      relatedUser: activeReviewType === 'trainer' ? selectedTrainer?._id : activeReviewType === 'staff' ? selectedStaff?._id : null,
    };
    await submitFeedback(data);
    await fetchRecentReviews();
    resetForm();
  };

  const resetForm = () => {
    setRating(0);
    setReviewText('');
    setSelectedTrainer(null);
    setSelectedStaff(null);
    setActiveReviewType(null);
    setError('');
  };

  return (
    <div className="bg-dark py-5">
      <Container>
        <h3 className="text-teal mb-4">Đánh Giá Dịch Vụ</h3>
        <Row className="mb-4">
          <Col md={4}><Card className="p-3 bg-dark text-light" onClick={() => setActiveReviewType('gym')} style={{ cursor: 'pointer' }}><CgGym size={28} /><h5 className='mt-3'>Phòng Gym</h5></Card></Col>
          <Col md={4}><Card className="p-3 bg-dark text-light" onClick={() => setActiveReviewType('trainer')} style={{ cursor: 'pointer' }}><FaUserGraduate size={28} /><h5 className='mt-3'>Huấn Luyện Viên</h5></Card></Col>
          <Col md={4}><Card className="p-3 bg-dark text-light" onClick={() => setActiveReviewType('staff')} style={{ cursor: 'pointer' }}><FaUsersGear size={28} /><h5 className='mt-3'>Nhân Viên</h5></Card></Col>
        </Row>

        <Row>
          <Col md={6}>
            {
              !activeReviewType && (
                <div className="text-secondary">
                  <h5>Vui lòng chọn loại đánh giá</h5>
                  <p className="mt-3">Chọn một trong các loại đánh giá bên trên để bắt đầu.</p>
                </div>
              )
            }
            {activeReviewType && (
              <div>
              <h5 className="text-teal mb-3">Đánh giá {activeReviewType === 'gym' ? 'Phòng Gym' : activeReviewType === 'trainer' ? 'Huấn Luyện Viên' : 'Nhân Viên'}</h5>
              <Card className="p-4 bg-dark text-light">
                {(activeReviewType === 'trainer' || activeReviewType === 'staff') && (
                  <Form.Group className="mb-3">
                    <Form.Label>Chọn:</Form.Label>
                    <Form.Select
                      className="bg-dark text-light"
                      onChange={(e) => {
                        const id = e.target.value;
                        activeReviewType === 'trainer'
                          ? setSelectedTrainer(trainers.find((t) => t._id === id))
                          : setSelectedStaff(staff.find((s) => s._id === id));
                      }}
                    >
                      <option value="">-- Chọn --</option>
                      {(activeReviewType === 'trainer' ? trainers : staff).map((u) => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Số sao:</Form.Label>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ cursor: 'pointer', fontSize: '1.5rem', color: i < rating ? '#ff6f61' : '#aaa' }} onClick={() => setRating(i + 1)}>★</span>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nhận xét:</Form.Label>
                  <Form.Control as="textarea" rows={3} className="bg-dark text-light" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button className="btn-coral rounded-pill px-4" onClick={handleSubmit}>Gửi đánh giá</Button>
              </Card>
              
              </div>
            )}
          </Col>

          <Col md={6}>
            <h5 className="text-teal mb-3">Đánh Giá Gần Đây</h5>
            {recentReviews.map((review) => (
              <Card key={review.id} className="p-3 mb-3 bg-dark text-light">
                <div className="mb-2">
                  <Badge bg="teal" className="me-2">{review.type}</Badge>
                  <strong>{review.userName}</strong>
                </div>
                <div>{[...Array(5)].map((_, i) => (<span key={i} style={{ color: i < review.rating ? '#ff6f61' : '#aaa' }}>★</span>))}</div>
                <div className="text-secondary mt-2">{review.comment}</div>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>

      <style>{`
        .bg-dark { background-color: #1a1a1a !important; }
        .text-teal { color: #00cc99 !important; }
        .btn-coral { background-color: #ff6f61 !important; border: none; }
      `}</style>
    </div>
  );
};

export default GymReview;
