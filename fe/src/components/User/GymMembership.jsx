import React, { useState, useEffect } from 'react';
import { getActiveMembership, getMembershipHistory, registerMembership } from '../../services/membershipApi';
import { getAllPackages } from '../../services/api';
import { getUserWorkoutProgress } from '../../services/workoutSessionApi';
import authService from '../../services/authService';
import { Badge, Button, Card, Col, Modal, ProgressBar, Row, Alert, Form } from 'react-bootstrap';

const GymMembership = () => {
  // State management (unchanged)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [memberPackages, setMemberPackages] = useState([]);
  const [membershipHistory, setMembershipHistory] = useState([]);
  const [workoutProgress, setWorkoutProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = authService.getCurrentUser();
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // useEffect and other functions (unchanged)
  useEffect(() => {
    if (!user || !user._id) {
      setError('Không tìm thấy thông tin hội viên. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }
    console.log('User ID for membership fetch:', user._id);
    setLoading(true);
    Promise.all([
      getAllPackages(),
      getActiveMembership(user._id),
      getMembershipHistory(user._id),
      getUserWorkoutProgress(user._id),
    ])
      .then(([pkgRes, activeRes, historyRes, progressRes]) => {
        setAvailablePackages(pkgRes.packages || []);

        let activeList = [];
        if (activeRes.success && Array.isArray(activeRes.memberships)) {
          activeList = activeRes.memberships.map((m) => ({
            id: m._id,
            package: m.package,
            coach: m.coach,
            startDate: m.startDate ? new Date(m.startDate).toLocaleDateString('vi-VN') : '',
            endDate: m.endDate ? new Date(m.endDate).toLocaleDateString('vi-VN') : '',
            sessionsRemaining: m.sessionsRemaining,
            status: m.paymentStatus === 'paid' ? 'active' : 'pending',
            paymentStatus: m.paymentStatus,
            isActive: m.isActive,
          }));
        }
        setMemberPackages(activeList);

        let historyList = [];
        if (historyRes.success && Array.isArray(historyRes.memberships)) {
          historyList = historyRes.memberships.map((m) => ({
            id: m._id,
            package: m.package,
            coach: m.coach,
            startDate: m.startDate ? new Date(m.startDate).toLocaleDateString('vi-VN') : '',
            endDate: m.endDate ? new Date(m.endDate).toLocaleDateString('vi-VN') : '',
            purchaseDate: m.createdAt ? new Date(m.createdAt).toLocaleDateString('vi-VN') : '',
            sessionsRemaining: m.sessionsRemaining,
            status: m.paymentStatus === 'paid' ? (new Date(m.endDate) < new Date() ? 'expired' : 'active') : 'pending',
            paymentStatus: m.paymentStatus,
          }));
        }
        setMembershipHistory(historyList);

        if (progressRes && progressRes.success) {
          setWorkoutProgress(progressRes);
        }
      })
      .catch((err) => {
        setError('Không thể kết nối tới server hoặc tải dữ liệu gói tập.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleRegister = (pkg) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  const handleRenew = (pkg) => {
    const packageToRenew = availablePackages.find((p) => p._id === pkg.id || p._id === pkg._id);
    setSelectedPackage(packageToRenew);
    setShowPaymentModal(true);
  };

  const handleClose = () => {
    setShowPaymentModal(false);
    setShowHistoryModal(false);
    setSelectedPackage(null);
  };

  const showHistory = () => {
    setShowHistoryModal(true);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="teal" className="fs-6">Đang hoạt động</Badge>;
      case 'pending':
        return <Badge bg="coral" text="dark" className="fs-6">Chờ kích hoạt</Badge>;
      case 'expired':
        return <Badge bg="secondary" className="fs-6">Đã hết hạn</Badge>;
      default:
        return null;
    }
  };

  const renderPackageDetails = (pkg) => (
    <ul className="list-unstyled small">
      <li>
        <strong>Thời hạn:</strong> {pkg.durationInDays} ngày
      </li>
      <li>
        <strong>Số buổi tập:</strong> {pkg.sessionLimit}
      </li>
      <li>
        <strong>HLV riêng:</strong> {pkg.withTrainer ? 'Có' : 'Không'}
      </li>
    </ul>
  );

  const getPackageDetails = (membership) => {
    if (membership.package && typeof membership.package === 'object') {
      return membership.package;
    }
    const packageId = membership.package?._id || membership.packageId || membership.package;
    return availablePackages.find((pkg) => pkg._id === packageId) || {};
  };

  const handleConfirmRegister = async () => {
    if (!user || !selectedPackage) return;
    setRegistering(true);
    setRegisterError('');
    setRegisterSuccess('');
    try {
      const res = await registerMembership({
        userId: user._id,
        packageId: selectedPackage._id,
        paymentStatus: 'paid',
      });
      if (res.success) {
        setRegisterSuccess('Đăng ký gói tập thành công!');
        setShowPaymentModal(false);
        const [activeRes, historyRes] = await Promise.all([getActiveMembership(user._id), getMembershipHistory(user._id)]);
        let activeList = [];
        if (activeRes.success && Array.isArray(activeRes.memberships)) {
          activeList = activeRes.memberships.map((m) => ({
            id: m._id,
            package: m.package,
            coach: m.coach,
            startDate: m.startDate ? new Date(m.startDate).toLocaleDateString('vi-VN') : '',
            endDate: m.endDate ? new Date(m.endDate).toLocaleDateString('vi-VN') : '',
            sessionsRemaining: m.sessionsRemaining,
            status: m.paymentStatus === 'paid' ? 'active' : 'pending',
            paymentStatus: m.paymentStatus,
            isActive: m.isActive,
          }));
        }
        setMemberPackages(activeList);
        let historyList = [];
        if (historyRes.success && Array.isArray(historyRes.memberships)) {
          historyList = historyRes.memberships.map((m) => ({
            id: m._id,
            package: m.package,
            coach: m.coach,
            startDate: m.startDate ? new Date(m.startDate).toLocaleDateString('vi-VN') : '',
            endDate: m.endDate ? new Date(m.endDate).toLocaleDateString('vi-VN') : '',
            purchaseDate: m.createdAt ? new Date(m.createdAt).toLocaleDateString('vi-VN') : '',
            sessionsRemaining: m.sessionsRemaining,
            status: m.paymentStatus === 'paid' ? (new Date(m.endDate) < new Date() ? 'expired' : 'active') : 'pending',
            paymentStatus: m.paymentStatus,
          }));
        }
        setMembershipHistory(historyList);
      } else {
        setRegisterError(res.message || 'Đăng ký gói tập thất bại');
      }
    } catch (err) {
      setRegisterError('Đăng ký gói tập thất bại');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="container my-5">
      {error && <Alert variant="danger">{error}</Alert>}
      {/* Active membership section */}
      <Row className="mb-5">
        <Col xs={12} className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-teal">Gói tập đã đăng ký</h3>
          <Button variant="outline-light" size="sm" onClick={showHistory}>
            <i className="bi bi-clock-history me-1"></i>
            Xem lịch sử đăng ký
          </Button>
        </Col>

        <Col xs={12}>
          {memberPackages.length === 0 ? (
            <Alert variant="info">Bạn chưa có gói tập nào. Hãy đăng ký gói tập bên dưới.</Alert>
          ) : (
            <Row>
              {memberPackages.map((pkg) => {
                const pkgDetail = getPackageDetails(pkg);
                return (
                  <Col xs={12} className="mb-3" key={pkg.id}>
                    <Card className="bg-dark text-light border-0 rounded-4 shadow-lg package-card">
                      <Card.Body className="p-4">
                        <Row className="align-items-center">
                          <Col md={4} className="border-end border-secondary">
                            <h5 className="mb-1 text-teal fw-bold">Gói {pkgDetail.name || 'Không xác định'}</h5>
                            <div>{renderStatusBadge(pkg.status)}</div>
                            <p className="mt-3 mb-1 small">
                              <strong>Giá:</strong> {pkgDetail.price ? `${pkgDetail.price.toLocaleString()} VNĐ` : '-'}
                            </p>
                          </Col>
                          <Col md={5}>
                            <ul className="list-unstyled small mb-0">
                              <li className="mb-1">
                                <strong>Thời hạn:</strong> {pkgDetail.durationInDays ? `${pkgDetail.durationInDays} ngày` : '-'}
                              </li>
                              <li className="mb-1">
                                <strong>Số buổi tập:</strong> {pkgDetail.sessionLimit ?? '-'}
                              </li>
                              <li className="mb-1">
                                <strong>Số buổi còn lại:</strong> {pkg.sessionsRemaining ?? 'Không giới hạn'}
                              </li>
                              <li className="mb-1">
                                <strong>HLV phụ trách:</strong> {pkg.coach ? pkg.coach.name : 'Chưa có'}
                              </li>
                              <li className="mb-1">
                                <strong>HLV riêng:</strong> {pkgDetail.withTrainer ? 'Có' : 'Không'}
                              </li>
                            </ul>
                            <div className="d-flex small text-secondary">
                              <span className="me-3">
                                <strong>Bắt đầu:</strong> {pkg.startDate || '-'}
                              </span>
                              <span>
                                <strong>Hết hạn:</strong> {pkg.endDate || '-'}
                              </span>
                            </div>
                          </Col>
                          <Col md={3} className="text-center">
                            {workoutProgress?.progress && (
                              <div>
                                <Badge bg="coral" className="mb-2 fs-6">
                                  {workoutProgress.progress.sessionsCompleted}/{workoutProgress.progress.totalSessions}
                                </Badge>
                                <ProgressBar
                                  now={workoutProgress.progress.completionPercentage}
                                  variant="teal"
                                  className="rounded-pill"
                                  style={{ height: '6px' }}
                                />
                                <small className="text-secondary d-block mt-1">
                                  {workoutProgress.progress.completionPercentage.toFixed(1)}% hoàn thành
                                </small>
                              </div>
                            )}
                            <Button
                              variant="outline-coral"
                              className="mt-3 w-100 rounded-pill fw-semibold"
                              onClick={() => handleRenew(pkg)}
                            >
                              Gia Hạn
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>

      {/* Available packages section (updated for consistency) */}
      <Row className="mb-5">
        <Col xs={12} className="mb-3">
          <h3 className="text-teal border-bottom pb-2">Gói tập hiện có</h3>
        </Col>
        <Col xs={12}>
          <Row>
            {availablePackages.map((pkg) => (
              <Col md={6} lg={3} className="mb-4" key={pkg._id}>
                <Card className="bg-dark text-light border-0 rounded-4 shadow-lg package-card">
                  <Card.Header className="bg-teal text-dark text-center py-3">
                    <h5 className="mb-0 fw-bold">Gói {pkg.name}</h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    {renderPackageDetails(pkg)}
                    <div className="text-center mt-3">
                      <h5 className="text-coral">{pkg.price?.toLocaleString()} VNĐ</h5>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-dark border-0 p-4 pt-0">
                    <Button
                      variant="coral"
                      className="w-100 rounded-pill py-2 fw-semibold"
                      onClick={() => handleRegister(pkg)}
                    >
                      Đăng Ký
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="bg-teal text-dark">
          <Modal.Title>Thanh Toán Gói Tập</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          {selectedPackage && (
            <Row>
              <Col md={6}>
                <Card className="bg-dark text-light border-0">
                  <Card.Header className="bg-teal text-dark">
                    <h5 className="mb-0">Thông tin gói tập</h5>
                  </Card.Header>
                  <Card.Body>
                    <h6>Gói {selectedPackage.name}</h6>
                    {renderPackageDetails(selectedPackage)}
                    <p className="mt-3">
                      <strong>Giá:</strong> {selectedPackage.price?.toLocaleString()} VNĐ
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <h5>Thông tin cá nhân</h5>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và Tên</Form.Label>
                    <Form.Control type="text" value={user?.name || ''} readOnly className="bg-dark text-light" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Số Điện Thoại</Form.Label>
                    <Form.Control type="text" value={user?.phone || ''} readOnly className="bg-dark text-light" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={user?.email || ''} readOnly className="bg-dark text-light" />
                  </Form.Group>
                  <h5 className="mt-4">Phương thức thanh toán</h5>
                  <Form.Check
                    type="radio"
                    label="Thanh toán bằng thẻ"
                    name="paymentMethod"
                    id="cardPayment"
                    checked
                    readOnly
                    className="mb-2 text-light"
                  />
                  <Form.Check
                    type="radio"
                    label="Chuyển khoản ngân hàng"
                    name="paymentMethod"
                    id="bankTransfer"
                    readOnly
                    className="mb-2 text-light"
                  />
                  <Form.Check
                    type="radio"
                    label="Tiền mặt tại quầy"
                    name="paymentMethod"
                    id="cashPayment"
                    readOnly
                    className="text-light"
                  />
                </Form>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="outline-light" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="coral" onClick={handleConfirmRegister} disabled={registering}>
            {registering ? 'Đang xử lý...' : 'Xác Nhận Thanh Toán'}
          </Button>
          {registerError && <div className="text-danger mt-2">{registerError}</div>}
          {registerSuccess && <div className="text-success mt-2">{registerSuccess}</div>}
        </Modal.Footer>
      </Modal>

      {/* History Modal */}
      <Modal show={showHistoryModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="bg-teal text-dark">
          <Modal.Title>Lịch Sử Đăng Ký</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          {membershipHistory.map((history) => {
            const pkgDetail = getPackageDetails(history);
            return (
              <Card key={history.id} className="bg-dark text-light border-0 mb-3 rounded-4">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col>
                      <h6>Gói {pkgDetail.name || 'Không xác định'}</h6>
                      <p className="mb-1 small">
                        <strong>Ngày bắt đầu:</strong> {history.startDate}
                      </p>
                      <p className="mb-1 small">
                        <strong>Ngày hết hạn:</strong> {history.endDate}
                      </p>
                      <p className="mb-1 small">
                        <strong>Ngày mua:</strong> {history.purchaseDate}
                      </p>
                      <p className="mb-1 small">
                        <strong>HLV phụ trách:</strong> {history.coach ? history.coach.name : 'Chưa có'}
                      </p>
                      <p className="mb-1 small">
                        <strong>Số buổi tập:</strong> {history.sessionsRemaining ?? 'Không giới hạn'}
                      </p>
                      <p className="mb-0 small">
                        <strong>Giá:</strong> {pkgDetail.price ? pkgDetail.price.toLocaleString() + ' VNĐ' : ''}
                      </p>
                    </Col>
                    <Col xs="auto">{renderStatusBadge(history.status)}</Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })}
          {membershipHistory.length === 0 && <Alert variant="info">Bạn chưa có lịch sử đăng ký gói tập nào.</Alert>}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="outline-light" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .container {
          max-width: 1400px;
          background-color: #1a1a1a;
          padding: 2rem;
          border-radius: 1rem;
        }
        .package-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 255, 204, 0.2) !important;
        }
        .bg-teal {
          background-color: #00cc99 !important;
        }
        .text-teal {
          color: #00cc99 !important;
        }
        .bg-coral {
          background-color: #ff6f61 !important;
        }
        .text-coral {
          color: #ff6f61 !important;
        }
        .btn-coral {
          background-color: #ff6f61 !important;
          border-color: #ff6f61 !important;
        }
        .btn-coral:hover {
          background-color: #e65a50 !important;
          border-color: #e65a50 !important;
        }
        .btn-outline-coral {
          border-color: #ff6f61 !important;
          color: #ff6f61 !important;
        }
        .btn-outline-coral:hover {
          background-color: #ff6f61 !important;
          color: #fff !important;
        }
        .text-light {
          color: #e0e0e0 !important;
        }
        .text-secondary {
          color: #a0a0a0 !important;
        }
        .progress-bar.bg-teal {
          background-color: #00cc99 !important;
        }
      `}</style>
    </div>
  );
};

export default GymMembership;