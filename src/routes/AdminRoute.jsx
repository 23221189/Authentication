import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const AdminRoute = () => {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if(token && user?.role === 'admin'){
        return <Outlet/>;
    }
    return <Navigate to="/login" replace/>;
};

export default AdminRoute