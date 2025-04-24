import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ChevronLeft, ChevronRight, Edit2, Save, X, Plus } from 'lucide-react';
import './Schedule.css';

const initialWorkouts = {
    '2025-04-24': {
        title: 'Tập ngực và tay sau',
        description: 'Bench Press: 4x12\nFlying: 3x15\nTriceps Extensions: 4x12\nTriceps Dips: 3x15'
    },
    '2025-04-25': {
        title: 'Chân và bụng',
        description: 'Squat: 4x10\nLeg Press: 3x12\nCrunches: 3x20\nPlank: 3x60 giây'
    },
    '2025-04-26': {
        title: 'Tập lưng và tay trước',
        description: 'Pull-ups: 4x8\nBarbell Row: 3x12\nBiceps Curl: 4x12\nHammer Curl: 3x15'
    },
};

function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

const ScheduleCalendar = () => {
    const [value, setValue] = useState(new Date());
    const [activeStartDate, setActiveStartDate] = useState(new Date());
    const [workouts, setWorkouts] = useState(initialWorkouts);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempWorkout, setTempWorkout] = useState({ title: '', description: '' });

    const handleMonthChange = (direction) => {
        const newDate = new Date(activeStartDate);
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        setActiveStartDate(newDate);
    };

    const handleDateClick = (date) => {
        setValue(date);
        setSelectedDate(date);
        const dateKey = formatDateKey(date);

        if (workouts[dateKey]) {
            setTempWorkout({ ...workouts[dateKey] });
        } else {
            setTempWorkout({ title: '', description: '' });
        }
        setIsEditing(false);
    };

    const handleAddWorkout = () => {
        setIsEditing(true);
    };

    const handleEditWorkout = () => {
        setIsEditing(true);
    };

    const handleSaveWorkout = () => {
        if (!selectedDate) return;

        const dateKey = formatDateKey(selectedDate);
        const updatedWorkouts = { ...workouts };

        if (tempWorkout.title.trim() === '') {
            delete updatedWorkouts[dateKey];
        } else {
            updatedWorkouts[dateKey] = { ...tempWorkout };
        }

        setWorkouts(updatedWorkouts);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        const dateKey = formatDateKey(selectedDate);
        if (workouts[dateKey]) {
            setTempWorkout({ ...workouts[dateKey] });
        } else {
            setTempWorkout({ title: '', description: '' });
        }
        setIsEditing(false);
    };

    const formatDate = (date) => {
        if (!date) return '';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                    <div className="position-relative">
                        {/* Calendar Card */}
                        <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
                            {/* Card Header */}
                            <div className="card-header bg-primary bg-gradient text-white py-3 d-flex justify-content-center align-items-center">
                                <h4 className="mb-0 fw-bold">Lịch Tập Luyện</h4>
                            </div>

                            {/* Card Body */}
                            <div className="card-body p-4">
                                <div className="position-relative">
                                    {/* Left Arrow */}
                                    <button
                                        onClick={() => handleMonthChange('prev')}
                                        className="btn btn-sm btn-outline-primary rounded-circle position-absolute top-50 start-0 translate-middle-y d-flex justify-content-center align-items-center"
                                        style={{ width: '36px', height: '36px', zIndex: 2 }}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    {/* Calendar */}
                                    <div className="calendar-container mx-5">
                                        <Calendar
                                            onChange={handleDateClick}
                                            value={value}
                                            activeStartDate={activeStartDate}
                                            onActiveStartDateChange={({ activeStartDate }) => {
                                                if (activeStartDate) setActiveStartDate(activeStartDate);
                                            }}
                                            tileContent={({ date, view }) => {
                                                const key = formatDateKey(date);
                                                return view === 'month' && workouts[key] ? (
                                                    <div className="workout-indicator text-primary">
                                                        {workouts[key].title}
                                                    </div>
                                                ) : null;
                                            }}
                                        />
                                    </div>

                                    {/* Right Arrow */}
                                    <button
                                        onClick={() => handleMonthChange('next')}
                                        className="btn btn-sm btn-outline-primary rounded-circle position-absolute top-50 end-0 translate-middle-y d-flex justify-content-center align-items-center"
                                        style={{ width: '36px', height: '36px', zIndex: 2 }}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="card-footer bg-light p-3">
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-primary" style={{ width: '12px', height: '12px' }}></div>
                                    <span className="ms-2 small text-muted">Ngày có lịch tập</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-lg rounded-3 h-100">
                        <div className="card-header bg-primary bg-gradient text-white py-3">
                            <h4 className="mb-0 fw-bold">
                                {selectedDate ? formatDate(selectedDate) : 'Chi tiết lịch tập'}
                            </h4>
                        </div>

                        <div className="card-body p-4">
                            {selectedDate ? (
                                <>
                                    {isEditing ? (
                                        <div className="workout-edit">
                                            <div className="mb-3">
                                                <label htmlFor="workoutTitle" className="form-label fw-bold">Tiêu đề</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="workoutTitle"
                                                    placeholder="Nhập tiêu đề lịch tập"
                                                    value={tempWorkout.title}
                                                    onChange={(e) => setTempWorkout({ ...tempWorkout, title: e.target.value })}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="workoutDescription" className="form-label fw-bold">Chi tiết bài tập</label>
                                                <textarea
                                                    className="form-control"
                                                    id="workoutDescription"
                                                    rows="10"
                                                    placeholder="Nhập chi tiết bài tập (mỗi bài tập một dòng)"
                                                    value={tempWorkout.description}
                                                    onChange={(e) => setTempWorkout({ ...tempWorkout, description: e.target.value })}
                                                ></textarea>
                                            </div>

                                            <div className="d-flex gap-2 justify-content-end">
                                                <button
                                                    className="btn btn-outline-secondary d-flex align-items-center gap-1"
                                                    onClick={handleCancelEdit}
                                                >
                                                    <X size={16} />
                                                    Hủy
                                                </button>
                                                <button
                                                    className="btn btn-primary d-flex align-items-center gap-1"
                                                    onClick={handleSaveWorkout}
                                                >
                                                    <Save size={16} />
                                                    Lưu
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="workout-details">
                                            {workouts[formatDateKey(selectedDate)] ? (
                                                <>
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h5 className="fw-bold text-primary mb-0">{workouts[formatDateKey(selectedDate)].title}</h5>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                                            onClick={handleEditWorkout}
                                                        >
                                                            <Edit2 size={16} />
                                                            Chỉnh sửa
                                                        </button>
                                                    </div>

                                                    <div className="workout-description">
                                                        {workouts[formatDateKey(selectedDate)].description || <em>Không có mô tả chi tiết</em>}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center py-5">
                                                    <div className="mb-3 text-muted">Chưa có lịch tập cho ngày này</div>
                                                    <button
                                                        className="btn btn-primary d-inline-flex align-items-center gap-1"
                                                        onClick={handleAddWorkout}
                                                    >
                                                        <Plus size={18} />
                                                        Thêm lịch tập
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <p>Vui lòng chọn một ngày để xem hoặc chỉnh sửa lịch tập</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleCalendar;