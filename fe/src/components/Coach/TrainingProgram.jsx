import { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';

const initialWorkoutPlans = [
    {
        id: 1,
        name: "Push Day",
        image: "/images/gymanh.jpg",
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
        image: "/images/gymanh.jpg",
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
        image: "/images/gymanh.jpg",
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
        image: "/images/gymanh.jpg",
        description: "Tập trung vào tim mạch",
        exercises: [
            { name: "Chạy bộ", sets: 1, reps: "20 phút", rest: "Không có" },
            { name: "HIIT", sets: 5, reps: "30s hoạt động/30s nghỉ", rest: "1 phút" },
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
        exercises: [{ name: "", sets: "", reps: "", rest: "" }]
    });

    const showWorkoutDetails = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    const addExerciseField = () => {
        setNewPlan({
            ...newPlan,
            exercises: [...newPlan.exercises, { name: "", sets: "", reps: "", rest: "" }]
        });
    };

    const handleInputChange = (e, index) => {
        if (index !== undefined) {
            const updatedExercises = [...newPlan.exercises];
            updatedExercises[index][e.target.name] = e.target.value;
            setNewPlan({ ...newPlan, exercises: updatedExercises });
        } else {
            setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
        }
    };

    const addNewPlan = () => {
        const newId = workoutPlans.length + 1;
        setWorkoutPlans([...workoutPlans, { ...newPlan, id: newId, image: "/images/gymanh.jpg" }]);
        setNewPlan({ name: "", description: "", exercises: [{ name: "", sets: "", reps: "", rest: "" }] });
        setIsAddFormOpen(false);
    };

    return (
        <div className="container py-5 bg-light min-vh-100 layout-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Chương trình tập luyện</h3>
                <button
                    className="btn d-flex align-items-center"
                    onClick={() => setIsAddFormOpen(true)}
                    style={{ whiteSpace: 'nowrap', background: '#0b8f50', color: '#fff' }}
                >
                    <Plus size={20} className="me-2" /> Thêm chương trình
                </button>
            </div>

            {isAddFormOpen && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h5 className="mb-3">Thêm chương trình mới</h5>
                        <div className="mb-3">
                            <input type="text" name="name" placeholder="Tên chương trình" value={newPlan.name}
                                onChange={handleInputChange} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <input type="text" name="description" placeholder="Mô tả" value={newPlan.description}
                                onChange={handleInputChange} className="form-control" />
                        </div>
                        <h6>Bài tập</h6>
                        {newPlan.exercises.map((exercise, index) => (
                            <div key={index} className="row g-3 mb-2">
                                <div className="col-md-3">
                                    <input type="text" name="name" placeholder="Tên bài tập" value={exercise.name}
                                        onChange={(e) => handleInputChange(e, index)} className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <input type="text" name="sets" placeholder="Số set" value={exercise.sets}
                                        onChange={(e) => handleInputChange(e, index)} className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <input type="text" name="reps" placeholder="Số rep" value={exercise.reps}
                                        onChange={(e) => handleInputChange(e, index)} className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <input type="text" name="rest" placeholder="Thời gian nghỉ" value={exercise.rest}
                                        onChange={(e) => handleInputChange(e, index)} className="form-control" />
                                </div>
                            </div>
                        ))}

                        <div className="d-flex gap-2 mt-3">
                            <button className="btn btn-success" onClick={addExerciseField}>Thêm bài tập</button>
                            <button className="btn btn-primary" onClick={addNewPlan}>Lưu chương trình</button>
                            <button className="btn btn-secondary" onClick={() => setIsAddFormOpen(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                {workoutPlans.map((plan) => (
                    <div key={plan.id} className="col">
                        <div className="card h-100 shadow-sm border-0" style={{ cursor: 'pointer' }}
                            onClick={() => showWorkoutDetails(plan)}>
                            <img src={plan.image} alt={plan.name} className="card-img-top"
                                style={{ height: '200px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title fw-bold">{plan.name}</h5>
                                <p className="card-text text-muted">{plan.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedPlan && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">{selectedPlan.name}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <img src={selectedPlan.image} alt={selectedPlan.name} className="img-fluid rounded mb-3"
                                    style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }} />
                                <h6 className="mb-3">Danh sách bài tập:</h6>
                                {selectedPlan.exercises.map((ex, idx) => (
                                    <div key={idx} className="mb-2 border rounded p-2 bg-light">
                                        <b>{ex.name}</b> | Sets: {ex.sets} | Reps: {ex.reps} | Rest: {ex.rest}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-secondary d-flex align-items-center" onClick={closeModal}>
                                    <ChevronLeft size={20} className="me-1" /> Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
