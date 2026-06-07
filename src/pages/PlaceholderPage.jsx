
import React from 'react';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            color: 'var(--color-text-light)'
        }}>
            <Construction size={64} style={{ marginBottom: '20px', opacity: 0.5 }} />
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-charcoal)' }}>{title}</h2>
            <p>This module is currently under development.</p>
        </div>
    );
};

export default PlaceholderPage;
