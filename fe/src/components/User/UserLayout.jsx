import React from 'react';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';

const UserLayout = ({ children }) => {
    return (
        <div>
            <div className="container">
                <UserHeader  />

                {/* Hero section */}
                <div style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1594737625785-c84c4ec6ba4f')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                </div>

                <main className="p-4 overflow-auto">{children}</main>
                
                <UserFooter/>
            </div>
        </div>
    );
};

export default UserLayout;
