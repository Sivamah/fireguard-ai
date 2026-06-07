
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, ShieldCheck, FileText, Settings, Building2 } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">
                    <ShieldCheck size={28} color="white" />
                </div>
                <span className="brand-name">FireGuard</span>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    <li className="nav-item">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/factories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <Building2 size={20} />
                            <span>Factories</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/risk-map" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <AlertTriangle size={20} />
                            <span>Risk Map</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <FileText size={20} />
                            <span>Reports</span>
                        </NavLink>
                    </li>
                    <li className="nav-item mt-auto">
                        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <Settings size={20} />
                            <span>Settings</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="user-mini-profile">
                    <div className="avatar">A</div>
                    <div className="user-info">
                        <span className="user-name">Admin User</span>
                        <span className="user-role">Safety Officer</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
