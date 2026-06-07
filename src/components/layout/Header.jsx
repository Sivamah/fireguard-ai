
import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-toggle">
                    <Menu size={20} />
                </button>
                <h1 className="page-title">Dashboard Overview</h1>
            </div>

            <div className="header-right">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search factories, risks..." />
                </div>

                <button className="notification-btn">
                    <Bell size={20} />
                    <span className="badge">3</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
