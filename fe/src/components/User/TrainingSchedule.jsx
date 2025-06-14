import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Award, CheckCircle2, XCircle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUserWorkoutSchedule } from '../../services/api';
import { getUserWorkoutSessions, createWorkoutSession, checkInWorkoutSession } from '../../services/workoutSessionApi';
import { getActiveMembership } from '../../services/membershipApi';
import authService from '../../services/authService';
import { Container, Card, Button, Alert, Badge, Row, Col } from 'react-bootstrap';
import { FaRegMessage } from "react-icons/fa6";
import { FaUserGraduate } from "react-icons/fa";

export default function UserTrainingSchedule() {
  const [scheduleData, setScheduleData] = useState({});
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [activeMembership, setActiveMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

        const scheduleRes = await getUserWorkoutSchedule(user._id);
        if (scheduleRes?.success) {
          const map = {};
          (scheduleRes.schedules || []).forEach((sch) => {
            (sch.schedule || []).forEach((item) => {
              if (item.time?.match(/^\d{4}-\d{2}-\d{2}/)) {
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
        }

        const sessionsRes = await getUserWorkoutSessions(user._id, 1, 100);
        if (sessionsRes?.success) {
          setWorkoutSessions(sessionsRes.workoutSessions || []);
        }

        const membershipRes = await getActiveMembership(user._id);
        if (membershipRes?.success && membershipRes.memberships?.length > 0) {
          setActiveMembership(membershipRes.memberships[0]);
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

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getCalendarWeeks = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const weeks = [];
    let currentWeek = [];

    for (let i = 0; i < (firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1); i++) {
      currentWeek.push(null);
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      currentWeek.push(new Date(year, month, day));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newDate);
  };

  const handleCreateSession = async (scheduleItem) => {
    try {
      if (!activeMembership) {
        alert('Bạn cần có gói tập hợp lệ để tạo buổi tập!');
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
      alert('Lỗi khi tạo buổi tập');
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
      alert('Lỗi khi check-in');
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

  const weeks = getCalendarWeeks(currentMonth.getFullYear(), currentMonth.getMonth());
  const selectedSchedules = scheduleData[formatDate(selectedDay)] || [];
  const selectedSessions = workoutSessions.filter((s) => {
    const sessionDate = new Date(s.workoutDate).toISOString().split('T')[0];
    return sessionDate === formatDate(selectedDay);
  });

  return (
    <div className="bg-dark py-5">
      <Container>
        <Card className="bg-dark text-light shadow rounded-4">
          <Card.Header className="text-danger d-flex justify-content-between align-items-center rounded-4">
            <Button variant="light" onClick={goToPreviousMonth}><ChevronLeft /></Button>
            <h5 style={{margin: 0}}>{currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</h5>
            <Button variant="light" onClick={goToNextMonth}><ChevronRight /></Button>
          </Card.Header>
          <Card.Body>
            <Row className="text-center mb-2">
              {['T2','T3','T4','T5','T6','T7','CN'].map((d, idx) => (
                <Col key={idx}><strong>{d}</strong></Col>
              ))}
            </Row>
            {weeks.map((week, weekIdx) => (
              <Row key={weekIdx} className="mb-2">
                {week.map((day, idx) => {
                  if (!day) return <Col key={idx}><div style={{ height: 80 }}></div></Col>;
                  const dateStr = formatDate(day);
                  const hasSchedule = scheduleData[dateStr]?.length > 0;
                  const isSelected = formatDate(day) === formatDate(selectedDay);
                  const isToday = formatDate(day) === formatDate(new Date());
                  return (
                    <Col key={idx}>
                      <Card className={`text-center ${isSelected ? 'bg-info text-white' : 'bg-dark text-light'} ${isToday ? 'border-teal border-2' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedDay(day)}>
                        <Card.Body className="p-2 d-flex flex-column justify-content-center align-items-center" style={{ height: '80px' }}>
                          <div>{day.getDate()}</div>
                          {hasSchedule && <Badge bg="warning" className="mt-1">Lịch</Badge>}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            ))}

            <h5 className="text-teal mt-4">Lịch chi tiết ngày {selectedDay.toLocaleDateString('vi-VN')}</h5>

            {(selectedSchedules.length === 0 && selectedSessions.length === 0) && (
              <div className="text-center py-3">
                <Award size={32} className="text-secondary" />
                <div>Không có lịch tập hôm nay</div>
              </div>
            )}

            {selectedSchedules.map((item, idx) => {
              const existingSession = selectedSessions.find(s => s.exerciseName === item.activity && s.startTime === item.startTime);
              return (
                <Card key={idx} className="mb-3 bg-secondary bg-opacity-10 text-light">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <h6>{item.activity}</h6>
                      <Badge bg="teal">{item.startTime} - {item.endTime}</Badge>
                    </div>
                    <div>HLV: {item.trainer || 'Tự tập'}</div>

                    <div className="mt-3">
                      {existingSession ? (
                        <div className="d-flex justify-content-center flex-column w-40">
                          {existingSession.status === 'scheduled' && (
                            <Button variant="success" size="sm" className="rounded-pill" onClick={() => handleCheckIn(existingSession._id)} disabled={loading}>Check-in</Button>
                          )}
                          {existingSession.status === 'checked_in' && (
                            <Badge bg="warning" text="dark" className="rounded-pill">Đã check-in - Chờ HLV check-out</Badge>
                          )}
                          {existingSession.status === 'completed' && (
                            <Badge bg="success" className="rounded-pill">Đã hoàn thành</Badge>
                          )}
                          {existingSession.status === 'cancelled' && (
                            <Badge bg="danger" className="rounded-pill">Đã hủy</Badge>
                          )}
                          {!existingSession.status && (
                            <>
                              {existingSession.isConfirmed ? (
                                <><CheckCircle2 size={16} className="text-success me-2" /><Badge bg="success" className="rounded-pill">Đã xác nhận</Badge></>
                              ) : (
                                <><XCircle size={16} className="text-warning me-2" /><Badge bg="warning" text="dark" className="rounded-pill">Chờ xác nhận</Badge></>
                              )}
                            </>
                          )}
                          {existingSession.notes && existingSession.status == 'completed' && (
                            <Alert variant="dark" className="border border-teal bg-dark bg-opacity-75 mt-2">
                              <div className="d-flex align-items-start">
                                <div className="flex-grow-1">
                                  <h6 className="alert-heading fs-6 mb-2 text-teal">
                                    <FaRegMessage /> <span>Phản hồi từ huấn luyện viên</span>
                                  </h6>
                                  <p className="mb-0 small text-light" style={{ whiteSpace: 'pre-wrap' }}>
                                    {existingSession.notes}
                                  </p>
                                </div>
                              </div>
                            </Alert>
                          )}

                       </div>

                      ) : (
                        <Button variant="outline-warning" size="sm" className="rounded-pill" onClick={() => handleCreateSession(item)} disabled={loading}>Tạo buổi tập</Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )
            })}

          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
