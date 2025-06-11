import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, User, Clock, Award, Calendar as CalendarIcon, CheckCircle2, XCircle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUserWorkoutSchedule } from '../../services/api';
import { getUserWorkoutSessions, createWorkoutSession, checkInWorkoutSession } from '../../services/workoutSessionApi';
import { getActiveMembership } from '../../services/membershipApi';
import authService from '../../services/authService';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { FaUserGraduate } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";

export default function UserTrainingSchedule() {
  const [scheduleData, setScheduleData] = useState({});
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [activeMembership, setActiveMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const user = authService.getCurrentUser();
        if (!user || !user._id) {
          setError('Không tìm thấy thông tin người dùng');
          setLoading(false);
          return;
        }

        // Fetch schedule data
        const scheduleRes = await getUserWorkoutSchedule(user._id);
        if (scheduleRes && scheduleRes.success) {
          const map = {};
          (scheduleRes.schedules || []).forEach((sch) => {
            (sch.schedule || []).forEach((item) => {
              if (item.time && item.time.match(/^\d{4}-\d{2}-\d{2}/)) {
                if (!map[item.time]) map[item.time] = [];
                map[item.time].push({
                  date: item.time,
                  startTime: item.startTime || '08:00',
                  endTime: item.endTime || '09:00',
                  activity: item.exercises?.join(', ') || '',
                  trainer: sch.coach?.name || null,
                  coachId: sch.coach?._id || null,
                  scheduleId: sch._id,
                });
              }
            });
          });
          setScheduleData(map);
        } else {
          console.warn('Failed to fetch schedule:', scheduleRes?.message || '');
        }

        // Fetch workout sessions - Fixed: Removed extra quote
        const sessionsRes = await getUserWorkoutSessions(user._id, 1, 100);
        if (sessionsRes && sessionsRes.success) {
          setWorkoutSessions(sessionsRes.workoutSessions || []);
        } else {
          console.warn('Failed to fetch workout sessions:', sessionsRes?.message || '');
        }

        // Fetch active membership
        const membershipRes = await getActiveMembership(user._id);
        if (membershipRes && membershipRes.success && membershipRes.memberships && membershipRes.memberships.length > 0) {
          setActiveMembership(membershipRes.memberships[0]);
        } else {
          console.warn('Failed to fetch membership:', membershipRes?.message || '');
        }

      } catch (err) {
        setError('Lỗi kết nối API');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDaysOfWeek = (date) => {
    const firstDay = new Date(date);
    firstDay.setDate(date.getDate() - date.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() + i);
      return day;
    });
  };

  const formatDate = (date) => {
    // Fixed: Removed extra quote and corrected syntax
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getScheduleForSelectedDay = () => {
    // Fixed: Added return statement
    return scheduleData[formatDate(selectedDay)] || [];
  };

  const getSessionsForSelectedDay = () => {
    const dateStr = formatDate(selectedDay);
    return workoutSessions.filter((session) => {
      const sessionDate = new Date(session.workoutDate).toISOString().split('T')[0];
      return sessionDate === dateStr;
    });
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const currentWeekDays = getDaysOfWeek(currentDate);

  const hasSchedule = (date) => {
    const dateStr = formatDate(date);
    const hasScheduleData = scheduleData[dateStr] && scheduleData[dateStr].length > 0;
    const hasSessions = workoutSessions.some((session) => {
      // Fixed: Removed extra dot before [0]
      const sessionDate = new Date(session.workoutDate).toISOString().split('T')[0];
      return sessionDate === dateStr;
    });
    return hasScheduleData || hasSessions;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date.getDate() === selectedDay.getDate() &&
      date.getMonth() === selectedDay.getMonth() &&
      date.getFullYear() === selectedDay.getFullYear();
  };

  const handleCreateSession = async (scheduleItem) => {
    try {
      const hasValidSchedule = Object.keys(scheduleData).length > 0;

      if (!activeMembership) {
        if (hasValidSchedule) {
          alert('Không tìm thấy gói tập hợp lệ. Vui lòng liên hệ với quản lý hoặc huấn luyện viên để kiểm tra tình trạng membership.');
        } else {
          alert('Bạn cần có gói tập hợp lệ để tạo buổi tập!');
        }
        return;
      }

      setLoading(true);
      await createWorkoutSession({
        membershipId: activeMembership._id,
        workoutDate: scheduleItem.date,
        startTime: scheduleItem.startTime,
        endTime: scheduleItem.endTime,
        exerciseName: scheduleItem.activity,
        notes: '',
        coachId: scheduleItem.coachId,
      });

      const user = authService.getCurrentUser();
      const sessionsRes = await getUserWorkoutSessions(user._id, 1, 100);
      if (sessionsRes.success) {
        setWorkoutSessions(sessionsRes.workoutSessions || []);
      }

      alert('Tạo buổi tập thành công!');
    } catch (err) {
      alert('Lỗi khi tạo buổi tập: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (sessionId) => {
    try {
      setLoading(true);
      await checkInWorkoutSession(sessionId);

      const user = authService.getCurrentUser();
      const sessionsRes = await getUserWorkoutSessions(user._id, 1, 100);
      if (sessionsRes.success) {
        setWorkoutSessions(sessionsRes.workoutSessions || []);
      }

      alert('Check-in thành công!');
    } catch (err) {
      alert('Lỗi khi check-in: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5 text-light">Đang tải lịch tập...</div>;
  }
  if (error) {
    return <Alert variant="danger" className="m-4">{error}</Alert>;
  }

  return (
    <div className="bg-dark py-5">
      <Container fluid style={{ maxWidth: '1400px' }}>
        <Card className="bg-dark text-light border-0 shadow-lg rounded-4">
          <Card.Header className="bg-teal text-white p-4 rounded-top-4 border-0">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Calendar size={28} className="me-3" />
                <h2 className="h4 mb-0">Lịch tập luyện</h2>
              </div>
              <Badge bg="light" text="teal" className="rounded-pill fs-6 px-3 py-2">
                {new Date().toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Badge>
            </div>
          </Card.Header>

          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Button
                variant="outline-light"
                className="d-flex align-items-center rounded-pill"
                onClick={goToPreviousWeek}
              >
                <ChevronLeft size={18} className="me-1" /> Tuần trước
              </Button>
              <h5 className="fw-bold text-teal mb-0">
                {currentWeekDays[0].toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}
                <span className="mx-2">-</span>
                {currentWeekDays[6].toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}
              </h5>
              <Button
                variant="outline-light"
                className="d-flex align-items-center rounded-pill"
                onClick={goToNextWeek}
              >
                Tuần sau <ChevronRight size={18} className="ms-1" />
              </Button>
            </div>

            <Row xs={7} className="g-2 mb-4">
              {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map((day, index) => {
                const dayDate = currentWeekDays[index];
                const hasTraining = hasSchedule(dayDate);
                const todayClass = isToday(dayDate) ? 'border-teal border-2' : '';
                const selectedClass = isSelected(dayDate) ? 'bg-teal text-white' : hasTraining ? 'bg-coral bg-opacity-25' : '';

                return (
                  <Col key={index}>
                    <Card
                      className={`h-100 bg-dark text-light border-0 shadow-sm ${todayClass} ${selectedClass}`}
                      onClick={() => setSelectedDay(dayDate)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Header
                        className={`text-center py-2 ${isSelected(dayDate) ? 'bg-teal text-white' : hasTraining ? 'bg-coral text-white' : 'bg-dark text-secondary'}`}
                      >
                        <strong>{day}</strong>
                      </Card.Header>
                      <Card.Body className="p-2 text-center">
                        <h5 className="display-6 my-2">{dayDate.getDate()}</h5>
                        <p className="small mb-1 text-secondary">{dayDate.toLocaleDateString('vi-VN', { month: 'numeric' })}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            <Card className="bg-dark text-light border-0 shadow-sm">
              <Card.Header className="bg-dark border-bottom border-secondary">
                <h5 className="mb-0 text-teal fw-bold">
                  <CalendarIcon size={18} className="me-2" />
                  Lịch ngày{' '}
                  {selectedDay.toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  })}
                </h5>
              </Card.Header>
              <Card.Body className="p-3">
                {/* Display scheduled items */}
                {getScheduleForSelectedDay().length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-teal fw-bold mb-3">
                      <Calendar size={16} className="me-2" />
                      Lịch tập được xếp
                    </h6>
                    <Row xs={1} md={2} className="g-3">
                      {getScheduleForSelectedDay().map((item, index) => {
                        const existingSession = workoutSessions.find((session) => {
                          const sessionDate = new Date(session.workoutDate).toISOString().split('T')[0];
                          const scheduleDate = item.date;
                          const sessionTime = `${session.startTime}-${session.endTime}`;
                          const scheduleTime = `${item.startTime}-${item.endTime}`;
                          return (
                            sessionDate === scheduleDate &&
                            session.exerciseName === item.activity &&
                            sessionTime === scheduleTime
                          );
                        });

                        return (
                          <Col key={index}>
                            <Card className="h-100 bg-dark text-light border-0 shadow-sm">
                              <Card.Body>
                                <div className="d-flex justify-content-between mb-3">
                                  <h6 className="fw-bold text-teal mb-0">{item.activity}</h6>
                                  <Badge bg="teal" className="rounded-pill d-flex align-items-center">
                                    <Clock size={14} className="me-1" />
                                    {item.startTime} - {item.endTime}
                                  </Badge>
                                </div>
                                <div className="d-flex align-items-center mb-3">
                                  <div className="rounded-circle bg-dark p-2 me-2 border border-teal">
                                    <FaUserGraduate fontSize={20} className='text-teal'/>
                                  </div>
                                  <span>
                                    {item.trainer ? (
                                      <>
                                        <span>HLV:</span> {item.trainer}
                                      </>
                                    ) : (
                                      <span>Tự tập</span>
                                    )}
                                  </span>
                                </div>
                                <div className="mt-3">
                                  {existingSession ? (
                                    <div className="d-flex align-items-center flex-wrap gap-2">
                                      {existingSession.status === 'scheduled' && (
                                        <Button
                                          variant="success"
                                          size="sm"
                                          className="rounded-pill"
                                          onClick={() => handleCheckIn(existingSession._id)}
                                          disabled={loading}
                                        >
                                          Check-in
                                        </Button>
                                      )}
                                      {existingSession.status === 'checked_in' && (
                                        <Badge bg="warning" text="dark" className="rounded-pill">
                                          Đã check-in - Chờ HLV check-out
                                        </Badge>
                                      )}
                                      {existingSession.status === 'completed' && (
                                        <Badge bg="success" className="rounded-pill">
                                          Đã hoàn thành
                                        </Badge>
                                      )}
                                      {existingSession.status === 'cancelled' && (
                                        <Badge bg="danger" className="rounded-pill">
                                          Đã hủy
                                        </Badge>
                                      )}
                                      {!existingSession.status && (
                                        <>
                                          {existingSession.isConfirmed ? (
                                            <>
                                              <CheckCircle2 size={16} className="text-success me-2" />
                                              <Badge bg="success" className="rounded-pill">
                                                Đã xác nhận
                                              </Badge>
                                            </>
                                          ) : (
                                            <>
                                              <XCircle size={16} className="text-warning me-2" />
                                              <Badge bg="warning" text="dark" className="rounded-pill">
                                                Chờ xác nhận
                                              </Badge>
                                            </>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  ) : (
                                    <Button
                                      variant="outline-coral"
                                      size="sm"
                                      className="rounded-pill"
                                      onClick={() => handleCreateSession(item)}
                                      disabled={loading}
                                    >
                                      Tạo buổi tập
                                    </Button>
                                  )}
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                )}

                {/* Display workout sessions */}
                {getSessionsForSelectedDay().length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-coral fw-bold mb-3">
                      <Award size={16} className="me-2" />
                      Buổi tập đã tạo
                    </h6>
                    <Row xs={1} md={2} className="g-3">
                      {getSessionsForSelectedDay().map((session, index) => (
                        <Col key={index}>
                          <Card className="h-100 bg-dark text-light border-0 shadow-sm">
                            <Card.Body>
                              <div className="d-flex justify-content-between mb-3">
                                <h6 className="fw-bold text-coral mb-0">{session.exerciseName}</h6>
                                <Badge bg="coral" className="rounded-pill d-flex align-items-center">
                                  <Clock size={14} className="me-1" />
                                  {session.startTime} - {session.endTime}
                                </Badge>
                              </div>
                              <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle bg-dark p-2 me-2 border border-coral">
                                  <FaUserGraduate size={20} className="text-coral" />
                                </div>
                                <span>
                                  {session.coach ? (
                                    <>
                                      <span>HLV:</span> {session.coach.name}
                                    </>
                                  ) : (
                                    <span>Tự tập</span>
                                  )}
                                </span>
                              </div>
                              {session.notes && session.status === 'completed' && (
                                <Alert variant="light" className="border-teal bg-teal bg-opacity-10 mb-3">
                                  <div className="d-flex align-items-start">
                                    <div className="text-teal me-2 mt-1">
                                      <Award size={16} />
                                    </div>
                                    <div className="flex-grow-1">
                                      <h6 className="alert-heading fs-6 mb-2 text-white"><FaRegMessage /> <span>Phản hồi từ huấn luyện viên</span></h6>
                                      <p className="mb-0 small text-white" style={{ whiteSpace: 'pre-wrap' }}>
                                        {session.notes}
                                      </p>
                                    </div>
                                  </div>
                                </Alert>
                              )}
                              {session.notes && session.status !== 'completed' && (
                                <div className="mb-3">
                                  <small className="text-secondary">
                                    <strong>Ghi chú:</strong> {session.notes}
                                  </small>
                                </div>
                              )}
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                  {session.status === 'scheduled' && (
                                    <Button
                                      variant="success"
                                      size="sm"
                                      className="rounded-pill"
                                      onClick={() => handleCheckIn(session._id)}
                                      disabled={loading}
                                    >
                                      Check-in
                                    </Button>
                                  )}
                                  {session.status === 'checked_in' && (
                                    <Badge bg="warning" text="dark" className="rounded-pill">
                                      Đã check-in - Chờ HLV check-out
                                    </Badge>
                                  )}
                                  {session.status === 'completed' && (
                                    <Badge bg="success" className="rounded-pill">
                                      Đã hoàn thành
                                    </Badge>
                                  )}
                                  {session.status === 'cancelled' && (
                                    <Badge bg="danger" className="rounded-pill">
                                      Đã hủy
                                    </Badge>
                                  )}
                                  {!session.status && (
                                    <>
                                      {session.isConfirmed ? (
                                        <>
                                          <CheckCircle2 size={16} className="text-success me-2" />
                                          <Badge bg="success" className="rounded-pill">
                                            Đã xác nhận
                                          </Badge>
                                        </>
                                      ) : (
                                        <>
                                          <XCircle size={16} className="text-warning me-2" />
                                          <Badge bg="warning" text="dark" className="rounded-pill">
                                            Chờ xác nhận
                                          </Badge>
                                        </>
                                      )}
                                    </>
                                  )}
                                </div>
                                <small className="text-secondary">
                                  {new Date(session.createdAt).toLocaleString('vi-VN')}
                                </small>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* No schedule or sessions message */}
                {getScheduleForSelectedDay().length === 0 && getSessionsForSelectedDay().length === 0 && (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <Award size={48} className="text-secondary" />
                    </div>
                    <h5 className="text-secondary">Không có lịch tập cho ngày này</h5>
                    <p className="text-secondary small mb-0">
                      Hãy chọn một ngày khác hoặc liên hệ với huấn luyện viên để đặt lịch
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Container>

      <style>{`
        .bg-dark {
          background-color: #1a1a1a !important;
        }
        .bg-teal {
          background-color: #00cc99 !important;
        }
        .bg-coral {
          background-color: #ff6f61 !important;
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
        .border-coral {
          border-color: #ff6f61 !important;
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
          color: #ff6f61 !important;
          border-color: #ff6f61 !important;
        }
        .btn-outline-coral:hover {
          background-color: #ff6f61 !important;
          color: #fff !important;
        }
        .text-secondary {
          color: #a0a0a0 !important;
        }
        .hover-teal:hover {
          color: #00cc99 !important;
        }
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 255, 204, 0.2) !important;
        }
      `}</style>
    </div>
  );
}