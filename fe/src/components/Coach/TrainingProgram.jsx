    import React from 'react';

    const programs = [
        { id: 1, title: 'Giảm cân', duration: '4 tuần' },
        { id: 2, title: 'Tăng cơ', duration: '6 tuần' },
    ];

    const TrainingProgram = () => (
        <div>
            <h2 className="text-xl font-bold mb-4">Chương trình tập</h2>
            <ul>
                {programs.map(p => (
                    <li key={p.id}>{p.title} - {p.duration}</li>
                ))}
            </ul>
        </div>
    );

    export default TrainingProgram;