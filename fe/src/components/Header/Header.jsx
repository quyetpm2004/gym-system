import React from 'react';

const Header = () => (
    <header className="bg-white shadow p-4 d-flex justify-content-between align-items-center">
        <h1 className="text-xl font-semibold">Trang Administrator</h1>
        <div className="d-flex align-items-center">
            <div className="me-2 ">👤 Admin Patrick Nguyễn</div>
            <img
                src="https://github.com/mdo.png"
                alt="user"
                width="60"
                height="60"
                className="rounded-circle"
            />
        </div>
    </header>
);

export default Header;