import { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';

// Dữ liệu giả về các gói tập
const initialWorkoutPlans = [
    {
        id: 1,
        name: "Push Day",
        image: "/gymanh.jpg",
        description: "Tập phần trên",
        exercises: [
            { name: "Bench Press", sets: 4, reps: "8-10", rest: "90 giây" },
            { name: "Shoulder Press", sets: 3, reps: "10-12", rest: "60 giây" },
            { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "60 giây" },
            { name: "Tricep Dips", sets: 3, reps: "12-15", rest: "45 giây" },
            { name: "Chest Fly", sets: 3, reps: "12-15", rest: "45 giây" },
            { name: "Tricep Pushdown", sets: 3, reps: "12-15", rest: "45 giây" }
        ]
    },
    {
        id: 2,
        name: "Pull Day",
        image: "/gymanh.jpg",
        description: "Tập phần trên",
        exercises: [
            { name: "Pull Ups", sets: 4, reps: "6-8", rest: "90 giây" },
            { name: "Bent Over Rows", sets: 3, reps: "10-12", rest: "60 giây" },
            { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "60 giây" },
            { name: "Face Pull", sets: 3, reps: "12-15", rest: "45 giây" },
            { name: "Bicep Curls", sets: 3, reps: "12-15", rest: "45 giây" },
            { name: "Hammer Curls", sets: 3, reps: "12-15", rest: "45 giây" }
        ]
    },
    {
        id: 3,
        name: "Leg Day",
        image: "/gymanh.jpg",
        description: "Tập chân và cơ đùi",
        exercises: [
            { name: "Squat", sets: 4, reps: "8-10", rest: "120 giây" },
            { name: "Leg Press", sets: 3, reps: "10-12", rest: "90 giây" },
            { name: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "90 giây" },
            { name: "Leg Extension", sets: 3, reps: "12-15", rest: "60 giây" },
            { name: "Leg Curl", sets: 3, reps: "12-15", rest: "60 giây" },
            { name: "Calf Raises", sets: 4, reps: "15-20", rest: "45 giây" }
        ]
    },
    {
        id: 4,
        name: "Cardio",
        image: "/gymanh.jpg",
        description: "Tập trung vào tay",
        exercises: [
            { name: "Chạy bộ", sets: 1, reps: "20 phút", rest: "Không có" },
            { name: "HIIT", sets: 5, reps: "30s hoạt động/30s nghỉ", rest: "1 phút giữa các set" },
            { name: "Bơi lội", sets: 1, reps: "15 phút", rest: "Không có" },
            { name: "Nhảy dây", sets: 3, reps: "5 phút", rest: "2 phút" },
            { name: "Đạp xe", sets: 1, reps: "20 phút", rest: "Không có" },
            { name: "Burpee", sets: 4, reps: "15 lần", rest: "60 giây" }
        ]
    }
];

export default function TrainingProgram() {
    const [workoutPlans, setWorkoutPlans] = useState(initialWorkoutPlans);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [newPlan, setNewPlan] = useState({
        name: "",
        description: "",
        image: "",
        exercises: [{ name: "", sets: "", reps: "", rest: "" }]
    });

    // Hiển thị chi tiết gói tập
    const showWorkoutDetails = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    // Đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    // Thêm bài tập mới vào form
    const addExerciseField = () => {
        setNewPlan({
            ...newPlan,
            exercises: [...newPlan.exercises, { name: "", sets: "", reps: "", rest: "" }]
        });
    };

    // Cập nhật form dữ liệu
    const handleInputChange = (e, index) => {
        if (index !== undefined) {
            const updatedExercises = [...newPlan.exercises];
            updatedExercises[index][e.target.name] = e.target.value;
            setNewPlan({ ...newPlan, exercises: updatedExercises });
        } else {
            setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
        }
    };

    // Thêm chương trình tập mới
    const addNewPlan = () => {
        const newId = workoutPlans.length + 1;
        setWorkoutPlans([...workoutPlans, { ...newPlan, id: newId }]);
        setNewPlan({
            name: "",
            description: "",
            image: "",
            exercises: [{ name: "", sets: "", reps: "", rest: "" }]
        });
        setIsAddFormOpen(false);
    };

    return (
        <div className="container py-5 bg-light min-vh-100 layout-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Chương trình tập luyện</h3>
                <button
                    className="btn d-flex align-items-center"
                    onClick={() => setIsAddFormOpen(true)}
                    style={{ whiteSpace: 'nowrap', background: '#0b8f50', color: '#fff'}}
                >
                    <Plus size={20} className="me-2" />
                    Thêm chương trình
                </button>
            </div>

            {/* Form thêm chương trình tập */}
            {isAddFormOpen && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h3 className="card-title h5 mb-3">Thêm chương trình mới</h3>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Tên chương trình"
                                    value={newPlan.name}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Mô tả"
                                    value={newPlan.description}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-12">
                                <input
                                    type="text"
                                    name="image"
                                    placeholder="URL hình ảnh"
                                    value={newPlan.image}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <h4 className="mt-4 mb-2">Bài tập</h4>
                        {newPlan.exercises.map((exercise, index) => (
                            <div key={index} className="row g-3 mb-2">
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Tên bài tập"
                                        value={exercise.name}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        name="sets"
                                        placeholder="Số set"
                                        value={exercise.sets}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        name="reps"
                                        placeholder="Số rep"
                                        value={exercise.reps}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        name="rest"
                                        placeholder="Thời gian nghỉ"
                                        value={exercise.rest}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="d-flex gap-2 mt-3">
                            <button
                                className="btn btn-success"
                                onClick={addExerciseField}
                            >
                                Thêm bài tập
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={addNewPlan}
                            >
                                Lưu chương trình
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setIsAddFormOpen(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Danh sách chương trình tập */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                {workoutPlans.map((plan) => (
                    <div key={plan.id} className="col">
                        <div
                            className="card h-100 shadow-sm border-0"
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => showWorkoutDetails(plan)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img
                                src={plan.image}
                                alt={plan.name}
                                className="card-img-top"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title fw-bold">{plan.name}</h5>
                                <p className="card-text text-muted">{plan.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal chi tiết chương trình */}
            {isModalOpen && selectedPlan && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">{selectedPlan.name}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <img
                                    src={selectedPlan.image}
                                    alt={selectedPlan.name}
                                    className="img-fluid rounded mb-3"
                                    style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                                />
                                <div className="card">
                                    <div className="card-header bg-primary text-white">
                                        <h6 className="mb-0">Danh sách bài tập</h6>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="row row-cols-1 row-cols-md-2 g-3 p-3">
                                            {selectedPlan.exercises.map((exercise, index) => (
                                                <div key={index} className="col">
                                                    <div className="card h-100 border-light shadow-sm">
                                                        <div className="card-body">
                                                            <h6 className="card-title fw-semibold">{exercise.name}</h6>
                                                            <p className="card-text mb-1 small">Sets: {exercise.sets}</p>
                                                            <p className="card-text mb-1 small">Reps: {exercise.reps}</p>
                                                            <p className="card-text mb-0 small">Nghỉ: {exercise.rest}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary d-flex align-items-center"
                                    onClick={closeModal}
                                >
                                    <ChevronLeft size={20} className="me-1" />
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}