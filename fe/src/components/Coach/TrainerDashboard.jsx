import React, { useState, useEffect } from 'react';
import './TrainerDashboard.css'; // Đảm bảo file CSS được import

export default function TrainerDashboard() {
    const slides = [
        { src: '/gym1.jpg', alt: 'Slide 1' },
        { src: '/gym2.jpg', alt: 'Slide 2' },
        { src: '/gym3.jpg', alt: 'Slide 3' },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Tự động chuyển slide sau 3 giây
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 3000);

        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, [slides.length]);

    // Chuyển slide trước/sau
    const plusSlides = (n) => {
        setCurrentSlide((prevSlide) => {
            let newIndex = prevSlide + n;
            if (newIndex >= slides.length) newIndex = 0;
            if (newIndex < 0) newIndex = slides.length - 1;
            return newIndex;
        });
    };

    // Chuyển đến slide cụ thể
    const setCurrentSlideIndex = (index) => {
        setCurrentSlide(index);
    };
    return (
        <div className="slideshow-container">
            <div className="mb-4">
                <h4>Dashboard</h4>
                <p>
                    Chào mừng đến với hệ thống phòng gym của chúng tôi với tư
                    cách <strong>Huấn luyện viên</strong>
                </p>
            </div>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`slide ${
                        index === currentSlide ? 'active' : ''
                    }`}
                    style={{
                        display: index === currentSlide ? 'block' : 'none',
                        borderRadius: '20px',
                        height: '460px',
                        overflow: 'hidden',
                    }}>
                    <img
                        src={slide.src}
                        alt={slide.alt}
                        className="img-fluid dashboard-img"
                    />
                </div>
            ))}

            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="prev"
                onClick={() => plusSlides(-1)}>
                <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="next"
                onClick={() => plusSlides(-1)}>
                <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>

            {/* Chỉ báo (dots) */}
            <div className="dots-container">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${
                            index === currentSlide ? 'active' : ''
                        }`}
                        onClick={() => setCurrentSlideIndex(index)}></span>
                ))}
            </div>
        </div>
    );
}
