import React from 'react';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';

const UserLayout = ({ children }) => {
    return (
        <div style={{backgroundColor: '#1a1a1a'}}>
            <div className="container" >
                <UserHeader  />

                <main className="overflow-auto mt-5" >{children}</main>
                
                <UserFooter/>
            </div>
        </div>
    );
};

export default UserLayout;
