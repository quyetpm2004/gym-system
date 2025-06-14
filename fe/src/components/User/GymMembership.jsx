import React, { useState, useEffect } from 'react';
import { getActiveMembership, getMembershipHistory, registerMembership } from '../../services/membershipApi';
import { getAllPackages } from '../../services/api';
import authService from '../../services/authService';
import { Badge, Button, Card, Col, Row, Modal, Alert, ProgressBar, Spinner } from 'react-bootstrap';
import { FaRunning, FaHistory, FaShoppingCart } from 'react-icons/fa';

const GymMembership = () => {
  const user = authService.getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [activeMembership, setActiveMembership] = useState([]);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Hàm load dữ liệu riêng biệt để có thể gọi lại nhiều lần
  const loadMembershipData = async () => {
    if (!user || !user._id) return;
    
    try {
      const [activeRes, historyRes] = await Promise.all([
        getActiveMembership(user._id),
        getMembershipHistory(user._id)
      ]);
      
      setActiveMembership(activeRes?.memberships || null);
      setHistory(historyRes?.memberships || []);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu membership:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    }
  };

  // Load dữ liệu ban đầu
  useEffect(() => {
    if (!user || !user._id) return;

    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [packagesRes, activeRes, historyRes] = await Promise.all([
          getAllPackages(),
          getActiveMembership(user._id),
          getMembershipHistory(user._id)
        ]);
        
        setAvailablePackages(packagesRes?.packages || []);
        setActiveMembership(activeRes?.memberships?.[0] || null);
        setHistory(historyRes?.memberships || []);
        setError(null);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu ban đầu:', error);
        setError('Không thể tải dữ liệu. Vui lòng tải lại trang.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [user?._id]);

  const handleRegister = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
    setRegistrationSuccess(false);
    setError(null);
  };

  const confirmRegister = async () => {
    if (!user || !selectedPackage) return;
    
    setRegistering(true);
    setError(null);
    
    try {
      // Đăng ký membership
      const response = await registerMembership({
        userId: user._id,
        packageId: selectedPackage._id,
        paymentStatus: 'paid',
      });

      console.log('Đăng ký thành công:', response);

      // Đợi một chút để đảm bảo dữ liệu đã được commit
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Thử load lại dữ liệu với retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await loadMembershipData();
          
          // Kiểm tra xem có membership mới không
          const newActiveRes = await getActiveMembership(user._id);
          const newActiveMembership = newActiveRes?.memberships?.[0];
          
          if (newActiveMembership && newActiveMembership.package?._id === selectedPackage._id) {
            // Tìm thấy membership mới, cập nhật state
            setActiveMembership(newActiveMembership);
            setRegistrationSuccess(true);
            break;
          }
          
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (retryError) {
          console.error(`Lần thử ${retryCount + 1} thất bại:`, retryError);
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      if (retryCount >= maxRetries) {
        setError('Đăng ký thành công nhưng dữ liệu chưa cập nhật. Vui lòng tải lại trang.');
      }

    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    } finally {
      setRegistering(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRegistrationSuccess(false);
    setError(null);
    setSelectedPackage(null);
  };

  // Hàm để force refresh dữ liệu
  const handleRefreshData = async () => {
    setLoading(true);
    await loadMembershipData();
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-dark py-5 text-center">
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-3">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="bg-dark py-5">
      <div className="container">
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
            <Button variant="outline-danger" size="sm" className="ms-2" onClick={handleRefreshData}>
              Tải lại
            </Button>
          </Alert>
        )}

        {/* Hiển thị thông báo thành công */}
        {registrationSuccess && (
          <Alert variant="success" className="mb-4">
            🎉 Đăng ký gói tập thành công! Gói tập của bạn đã được cập nhật.
          </Alert>
        )}

        {/* GÓI HIỆN TẠI */}
        <Row className="mb-5">
          <Col md={12}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="text-teal mb-0">
                <FaRunning className="me-2" /> Gói Tập Của Bạn
              </h3>
              <Button variant="outline-light" size="sm" onClick={handleRefreshData}>
                Làm mới
              </Button>
            </div>
            
            {activeMembership && activeMembership.length > 0 ? (
              activeMembership.map((membership) => (
                <Card key={membership._id} className="p-4 bg-dark text-light border border-teal rounded-4 shadow mb-3">
                  <h5>Gói: {membership.package?.name}</h5>
                  <p><strong>HLV: </strong>{membership.coach?.name || 'Chưa có'}</p>
                  <p><strong>Bắt đầu:</strong> {new Date(membership.startDate).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Kết thúc:</strong> {new Date(membership.endDate).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Còn lại: </strong>{membership.sessionsRemaining} buổi</p>
                  <ProgressBar 
                    now={membership.sessionsRemaining / membership.package.sessionLimit * 100}
                    variant="teal" 
                    className="rounded-pill" 
                    style={{ height: 8 }} 
                  />
                </Card>
              ))
            ) : (
              <Alert variant="warning">
                Bạn chưa đăng ký gói tập nào!
                <Button variant="outline-warning" size="sm" className="ms-2" onClick={handleRefreshData}>
                  Kiểm tra lại
                </Button>
              </Alert>
            )}
          </Col>
        </Row>

        {/* DANH SÁCH GÓI ĐĂNG KÝ */}
        <Row className="mb-5">
          <Col md={12}>
            <h3 className="text-coral mb-3"><FaShoppingCart className="me-2" /> Các Gói Tập Hiện Có</h3>
            <Row>
              {availablePackages.map((pkg) => (
                <Col md={3} key={pkg._id} className="mb-4">
                  <Card className="p-3 bg-dark text-light border rounded-4 shadow-lg h-100">
                    <h5 className="text-center">{pkg.name}</h5>
                    <p><strong>Thời hạn: </strong>{pkg.durationInDays} ngày</p>
                    <p><strong>Buổi tập: </strong>{pkg.sessionLimit}</p>
                    <p><strong>HLV riêng: </strong>{pkg.withTrainer ? 'Có' : 'Không'}</p>
                    <h5 className="text-coral text-center mt-3">{pkg.price.toLocaleString()} VNĐ</h5>
                    <Button 
                      variant="coral" 
                      className="mt-3 w-100 rounded-pill"
                      onClick={() => handleRegister(pkg)}
                      disabled={registering}
                    >
                      Đăng ký
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* LỊCH SỬ ĐĂNG KÝ */}
        <Row>
          <Col md={12}>
            <h3 className="text-teal mb-3"><FaHistory className="me-2" /> Lịch Sử Đăng Ký</h3>
            {history.length === 0 ? (
              <Alert variant="secondary">Chưa có lịch sử đăng ký</Alert>
            ) : (
              <div className="d-flex flex-column gap-3">
                {history.map((item) => (
                  <Card key={item._id} className="p-3 bg-dark text-light border rounded-4 shadow-sm">
                    <div><strong>Gói: </strong>{item.package?.name}</div>
                    <div><strong>Ngày mua: </strong>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</div>
                    <div><strong>Trạng thái: </strong>{item.paymentStatus === 'paid' ? (
                      <Badge bg="success">Đã thanh toán</Badge>) : (
                      <Badge bg="warning">Chưa thanh toán</Badge>)}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Col>
        </Row>
      </div>

      {/* MODAL THANH TOÁN VỚI QR */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-teal">
          <Modal.Title>Thanh Toán Gói Tập</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          {selectedPackage && (
            <>
              {registrationSuccess && (
                <Alert variant="success" className="mb-3">
                  🎉 Đăng ký thành công! Gói tập đã được kích hoạt.
                </Alert>
              )}
              
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <p>Bạn đang đăng ký: <strong>{selectedPackage.name}</strong></p>
              <p>Giá: <strong>{selectedPackage.price.toLocaleString()} VNĐ</strong></p>
              <p>Thời hạn: {selectedPackage.durationInDays} ngày / {selectedPackage.sessionLimit} buổi</p>

              <div className="text-center my-3 bg-light p-3 rounded-4">
                <h6>Quét mã QR để thanh toán:</h6>
                <img
                  src="/images/qrcode.svg"
                  alt="QR Code"
                  style={{ borderRadius: 12, border: '3px solid #00cc99' }}
                />
              </div>

              <Alert variant="info" className="mt-3">
                Sau khi đã quét QR & thanh toán xong, hãy nhấn "Tôi đã thanh toán" bên dưới để hoàn tất đăng ký.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="outline-light" onClick={handleCloseModal}>
            {registrationSuccess ? 'Đóng' : 'Huỷ'}
          </Button>
          {!registrationSuccess && (
            <Button variant="coral" onClick={confirmRegister} disabled={registering}>
              {registering ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang xử lý...
                </>
              ) : (
                'Tôi đã thanh toán'
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <style>{`
        .bg-dark { background-color: #1a1a1a !important; }
        .text-teal { color: #00cc99 !important; }
        .text-coral { color: #ff6f61 !important; }
        .btn-coral { background-color: #ff6f61 !important; border: none !important; }
        .btn-coral:hover { background-color: #e65a50 !important; }
        .border-teal { border-color: #00cc99 !important; }
        .progress-bar.bg-teal { background-color: #00cc99 !important; }
      `}</style>
    </div>
  );
};

export default GymMembership;