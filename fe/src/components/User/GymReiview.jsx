import React, { useState, useEffect } from 'react';
import './GymReview.css'; // Keep CSS import if needed
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
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
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
          const trainerList = allUsers
            .filter((u) => u.role === 'coach')
            .map((trainer) => ({
              id: trainer._id,
              name: trainer.name,
              specialization: 'Huấn luyện viên',
              image: trainer.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
            }));
          setTrainers(trainerList);
          const staffList = allUsers
            .filter((u) => u.role === 'staff')
            .map((staffMember) => ({
              id: staffMember._id,
              name: staffMember.name,
              department: 'Nhân viên hỗ trợ',
              image: staffMember.avatar || 'https://randomuser.me/api/portraits/women/1.jpg',
            }));
          setStaff(staffList);
        }
        await fetchRecentReviews();
      } catch (err) {
        setError('Lỗi tải dữ liệu: ' + (err.message || 'Unknown error'));
        console.error('Error fetching data:', err);
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
          userName: fb.user?.name || 'Ẩn danh',
          rating: fb.rating,
          date: new Date(fb.createdAt).toLocaleDateString('vi-VN'),
          comment: fb.message,
        })),
        ...(staffReviews.feedbacks || []).map((fb) => ({
          id: fb._id,
          type: 'staff',
          staffName: fb.relatedUser?.name,
          userName: fb.user?.name || 'Ẩn danh',
          rating: fb.rating,
          date: new Date(fb.createdAt).toLocaleDateString('vi-VN'),
          comment: fb.message,
        })),
        ...(trainerReviews.feedbacks || []).map((fb) => ({
          id: fb._id,
          type: 'trainer',
          trainerName: fb.relatedUser?.name,
          userName: fb.user?.name || 'Ẩn danh',
          rating: fb.rating,
          date: new Date(fb.createdAt).toLocaleDateString('vi-VN'),
          comment: fb.message,
        })),
      ];
      allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentReviews(allReviews.slice(0, 6));
    } catch (err) {
      console.error('Error fetching recent reviews:', err);
    }
  };

  const handleSelectReviewType = (type) => {
    setActiveReviewType(type);
    resetForm();
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setReviewText('');
    setSelectedTrainer(null);
    setSelectedStaff(null);
    setReviewSubmitted(false);
    setError('');
  };

  const handleSelectTrainer = (trainer) => {
    setSelectedTrainer(trainer);
  };

  const handleSelectStaff = (staffMember) => {
    setSelectedStaff(staffMember);
  };

  const handleSetRating = (value) => {
    setRating(value);
  };

  const handleMouseOver = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    let currentUser = user || authService.getCurrentUser();
    if (!currentUser) {
      setError('Bạn cần đăng nhập để gửi đánh giá');
      return;
    }
    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá');
      return;
    }
    if (!reviewText.trim()) {
      setError('Vui lòng nhập nội dung đánh giá');
      return;
    }
    if (activeReviewType === 'trainer' && !selectedTrainer) {
      setError('Vui lòng chọn huấn luyện viên');
      return;
    }
    if (activeReviewType === 'staff' && !selectedStaff) {
      setError('Vui lòng chọn nhân viên');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const feedbackData = {
        userId: currentUser.id || currentUser._id,
        rating: rating,
        message: reviewText,
        target: activeReviewType.toUpperCase(),
        relatedUser: activeReviewType === 'trainer' ? selectedTrainer?.id : activeReviewType === 'staff' ? selectedStaff?.id : null,
      };
      const result = await submitFeedback(feedbackData);
      if (result.success) {
        setReviewSubmitted(true);
        await fetchRecentReviews();
        setTimeout(() => {
          resetForm();
          setActiveReviewType(null);
        }, 3000);
      } else {
        setError('Gửi đánh giá thất bại: ' + (result.message || 'Lỗi không xác định'));
      }
    } catch (err) {
      setError('Lỗi kết nối: ' + (err.message || 'Không thể gửi đánh giá'));
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="star-rating mb-3">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <span
              key={index}
              className={`star ${ratingValue <= (hoverRating || rating) ? 'filled' : ''}`}
              onClick={() => handleSetRating(ratingValue)}
              onMouseOver={() => handleMouseOver(ratingValue)}
              onMouseLeave={handleMouseLeave}
              style={{ color: ratingValue <= (hoverRating || rating) ? '#ff6f61' : '#a0a0a0', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ★
            </span>
          );
        })}
        <span className="ms-2 text-secondary">{rating > 0 ? `${rating}/5` : 'Chưa đánh giá'}</span>
      </div>
    );
  };

  const renderStaffSelection = () => {
    return (
      <div className="staff-selection mb-4">
        <Form.Label className="text-teal fw-bold">Chọn Nhân Viên:</Form.Label>
        <Row xs={1} md={3} className="g-3">
          {staff.map((staffMember) => (
            <Col key={staffMember.id}>
              <Card
                className={`h-100 bg-dark text-light border-0 shadow-sm staff-card ${
                  selectedStaff?.id === staffMember.id ? 'border-teal' : ''
                }`}
                onClick={() => handleSelectStaff(staffMember)}
                style={{ cursor: 'pointer' }}
              >
                <Row className="g-0">
                  <Col xs={4}>
                    <Card.Img
                      src={staffMember.image}
                      alt={staffMember.name}
                      className="rounded-start"
                      style={{ objectFit: 'cover', height: '100%' }}
                    />
                  </Col>
                  <Col xs={8}>
                    <Card.Body className="py-2">
                      <Card.Title as="h6" className="mb-1 text-light">
                        {staffMember.name}
                      </Card.Title>
                      <Card.Text className="small text-secondary">{staffMember.department}</Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
        {staff.length === 0 && <div className="text-secondary text-center py-3">Không có nhân viên nào để đánh giá</div>}
        {selectedStaff && (
          <div className="mt-2 text-teal">
            <i className="bi bi-check-circle-fill me-1"></i> Đã chọn: {selectedStaff.name}
          </div>
        )}
      </div>
    );
  };

  const renderTrainerSelection = () => {
    return (
      <div className="trainer-selection mb-4">
        <Form.Label className="text-teal fw-bold">Chọn Huấn Luyện Viên:</Form.Label>
        <Row xs={1} md={3} className="g-3">
          {trainers.map((trainer) => (
            <Col key={trainer.id}>
              <Card
                className={`h-100 bg-dark text-light border-0 shadow-sm trainer-card ${
                  selectedTrainer?.id === trainer.id ? 'border-teal' : ''
                }`}
                onClick={() => handleSelectTrainer(trainer)}
                style={{ cursor: 'pointer' }}
              >
                <Row className="g-0">
                  <Col xs={4}>
                    <Card.Img
                      src={trainer.image}
                      alt={trainer.name}
                      className="rounded-start"
                      style={{ objectFit: 'cover', height: '100%' }}
                    />
                  </Col>
                  <Col xs={8}>
                    <Card.Body className="py-2">
                      <Card.Title as="h6" className="mb-1 text-light">
                        {trainer.name}
                      </Card.Title>
                      <Card.Text className="small text-secondary">{trainer.specialization}</Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
        {trainers.length === 0 && <div className="text-secondary text-center py-3">Không có huấn luyện viên nào để đánh giá</div>}
        {selectedTrainer && (
          <div className="mt-2 text-teal">
            <i className="bi bi-check-circle-fill me-1"></i> Đã chọn: {selectedTrainer.name}
          </div>
        )}
      </div>
    );
  };

  const renderGymReviewForm = () => {
    return (
      <div className="gym-review-form">
        <h4 className="text-teal fw-bold mb-4">Đánh Giá Phòng Gym</h4>
        {reviewSubmitted ? (
          <Alert variant="success">
            <i className="bi bi-check-circle-fill me-2"></i>
            Cảm ơn bạn đã gửi đánh giá! Phản hồi của bạn rất quan trọng đối với chúng tôi.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmitReview}>
            <Form.Group className="mb-3">
              <Form.Label className="text-teal fw-bold">Chất lượng tổng thể:</Form.Label>
              {renderStarRating()}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-teal fw-bold">Nhận xét của bạn:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Hãy chia sẻ trải nghiệm của bạn về cơ sở vật chất, trang thiết bị, dịch vụ, nhân viên,..."
                className="bg-dark text-light border-teal"
                required
              />
            </Form.Group>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="coral"
                className="rounded-pill px-4"
                disabled={rating === 0 || loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi Đánh Giá'}
              </Button>
              <Button
                type="button"
                variant="outline-light"
                className="rounded-pill px-4"
                onClick={() => setActiveReviewType(null)}
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
          </Form>
        )}
      </div>
    );
  };

  const renderTrainerReviewForm = () => {
    return (
      <div className="trainer-review-form">
        <h4 className="text-teal fw-bold mb-4">Đánh Giá Huấn Luyện Viên</h4>
        {reviewSubmitted ? (
          <Alert variant="success">
            <i className="bi bi-check-circle-fill me-2"></i>
            Cảm ơn bạn đã gửi đánh giá! Phản hồi của bạn giúp các huấn luyện viên của chúng tôi không ngừng cải thiện.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmitReview}>
            {renderTrainerSelection()}
            <Form.Group className="mb-3">
              <Form.Label className="text-teal fw-bold">Đánh giá huấn luyện viên:</Form.Label>
              {renderStarRating()}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-teal fw-bold">Nhận xét của bạn:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Hãy chia sẻ trải nghiệm của bạn về chuyên môn, phương pháp giảng dạy, thái độ phục vụ của huấn luyện viên,..."
                className="bg-dark text-light border-teal"
                required
              />
            </Form.Group>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="coral"
                className="rounded-pill px-4"
                disabled={rating === 0 || !selectedTrainer || loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi Đánh Giá'}
              </Button>
              <Button
                type="button"
                variant="outline-light"
                className="rounded-pill px-4"
                onClick={() => setActiveReviewType(null)}
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
          </Form>
        )}
      </div>
    );
  };

  const renderStaffReviewForm = () => {
    return (
      <div className="staff-review-form">
        <h4 className="text-teal fw-bold mb-4">Đánh Giá Nhân Viên</h4>
        {reviewSubmitted ? (
          <Alert variant="success">
            <i className="bi bi-check-circle-fill me-2"></i>
            Cảm ơn bạn đã gửi đánh giá! Phản hồi của bạn giúp chúng tôi cải thiện chất lượng dịch vụ.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmitReview}>
            {renderStaffSelection()}
            <Form.Group className="mb-3">
              <Form.Label className="text-teal fw-bold">Đánh giá nhân viên:</Form.Label>
              {renderStarRating()}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-teal fw-bold">Nhận xét của bạn:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Hãy chia sẻ trải nghiệm của bạn về thái độ phục vụ, hỗ trợ, và chuyên môn của nhân viên,..."
                className="bg-dark text-light border-teal"
                required
              />
            </Form.Group>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="coral"
                className="rounded-pill px-4"
                disabled={rating === 0 || !selectedStaff || loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi Đánh Giá'}
              </Button>
              <Button
                type="button"
                variant="outline-light"
                className="rounded-pill px-4"
                onClick={() => setActiveReviewType(null)}
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
          </Form>
        )}
      </div>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="review-stars">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className="star-display"
            style={{ color: index < rating ? '#ff6f61' : '#a0a0a0', fontSize: '1rem' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderRecentReviews = () => {
    return (
      <div className="recent-reviews mt-5">
        <h4 className="text-teal fw-bold mb-4">Đánh Giá Gần Đây</h4>
        {recentReviews.length === 0 ? (
          <p className="text-secondary">Chưa có đánh giá nào.</p>
        ) : (
          <Row xs={1} md={2} className="g-4">
            {recentReviews.map((review) => (
              <Col key={review.id}>
                <Card className="bg-dark text-light border-0 shadow-sm h-100">
                  <Card.Header className="bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
                    <div>
                      <Badge bg="teal" className="me-2">
                        {review.type === 'gym'
                          ? 'Phòng Gym'
                          : review.type === 'trainer'
                          ? 'Huấn Luyện Viên'
                          : 'Nhân Viên'}
                      </Badge>
                      {(review.trainerName || review.staffName) && (
                        <span className="text-secondary small">
                          - {review.trainerName || review.staffName}
                        </span>
                      )}
                    </div>
                    <small className="text-secondary">{review.date}</small>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <Card.Subtitle as="h6" className="text-light">
                        {review.userName}
                      </Card.Subtitle>
                      {renderStars(review.rating)}
                    </div>
                    <Card.Text className="text-secondary">{review.comment}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  };

  return (
    <div className="bg-dark py-5">
      <Container fluid>
        {/* Page header */}
        <Row className="mb-4">
          <Col>
            <h3 className="text-teal fw-bold mb-3">Đánh giá</h3>
            <p className="text-secondary">
              Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ.
            </p>
          </Col>
        </Row>

        {/* Review type selection */}
        {!activeReviewType && (
          <Row className="mb-5">
            <Col xs={12}>
              <h4 className="text-teal fw-bold mb-4">Bạn muốn đánh giá điều gì?</h4>
            </Col>
            <Col md={4} className="mb-3">
              <Card
                className="h-100 bg-dark text-light border-0 shadow-sm review-option-card"
                onClick={() => handleSelectReviewType('gym')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center p-5">
                  <div className="review-icon mb-3">
                    <CgGym fontSize={32} />
                  </div>
                  <Card.Title as="h5" className="text-light">
                    Đánh Giá Phòng Gym
                  </Card.Title>
                  <Card.Text className="text-secondary">
                    Hãy chia sẻ những cảm nhận của bạn về cơ sở vật chất của chúng tôi.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card
                className="h-100 bg-dark text-light border-0 shadow-sm review-option-card"
                onClick={() => handleSelectReviewType('trainer')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center p-5">
                  <div className="review-icon mb-3">
                    <FaUserGraduate fontSize={32}/>
                  </div>
                  <Card.Title as="h5" className="text-light">
                    Đánh Giá Huấn Luyện Viên
                  </Card.Title>
                  <Card.Text className="text-secondary">
                    Hãy chia sẻ cảm nhận của bạn về huấn luyện viên của mình.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card
                className="h-100 bg-dark text-light border-0 shadow-sm review-option-card"
                onClick={() => handleSelectReviewType('staff')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center p-5">
                  <div className="review-icon mb-3">
                    <FaUsersGear fontSize={32}/>
                  </div>
                  <Card.Title as="h5" className="text-light">
                    Đánh Giá Nhân Viên
                  </Card.Title>
                  <Card.Text className="text-secondary">
                    Hãy chia sẻ cảm nhận của bạn về nhân viên của chúng tôi.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Review forms */}
        {activeReviewType && (
          <div className="review-form-container bg-dark p-4 rounded-4 shadow-lg mb-5">
            {activeReviewType === 'gym' && renderGymReviewForm()}
            {activeReviewType === 'trainer' && renderTrainerReviewForm()}
            {activeReviewType === 'staff' && renderStaffReviewForm()}
          </div>
        )}

        {/* Recent reviews */}
        {renderRecentReviews()}
      </Container>

      <style>{`
        .bg-dark {
          background-color: #1a1a1a !important;
        }
        .text-teal {
          color: #00cc99 !important;
        }
        .text-coral {
          color: #ff6f61 !important;
        }
        .border-teal {
          border-color: #00cc99 !important;
        }
        .btn-coral {
          background-color: #ff6f61 !important;
          border-color: #ff6f61 !important;
        }
        .btn-coral:hover {
          background-color: #e65a50 !important;
          border-color: #e65a50 !important;
        }
        .text-secondary {
          color: #a0a0a0 !important;
        }
        .hover-teal:hover {
          color: #00cc99 !important;
        }
        .review-option-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .review-option-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 255, 204, 0.2) !important;
        }
        .star-rating .star.filled {
          color: #ff6f61 !important;
        }
        .form-control.bg-dark {
          background-color: #2a2a2a !important;
          border-color: #00cc99 !important;
          color: #e0e0e0 !important;
        }
        .form-control.bg-dark::placeholder {
          color: #a0a0a0 !important;
        }
        .staff-card:hover,
        .trainer-card:hover {
          box-shadow: 0 4px 15px rgba(0, 255, 204, 0.2) !important;
        }
        .bg-teal {
          background-color: #00cc99 !important;
        }
      `}</style>
    </div>
  );
};

export default GymReview;