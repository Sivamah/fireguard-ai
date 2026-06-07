import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('FireGuard AI caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', background: 'var(--bg-primary)', padding: 32, fontFamily: 'var(--font-sans)'
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--status-danger)',
            borderRadius: 'var(--radius-lg)', padding: 40, maxWidth: 600, width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--status-danger)', marginBottom: 12 }}>
              Something went wrong.
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
              An unexpected error occurred in the application. Our team has been notified.
            </p>
            
            <div style={{
              background: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)',
              fontSize: 12, fontFamily: 'monospace', color: 'var(--text-primary)',
              overflowX: 'auto', marginBottom: 24, whiteSpace: 'pre-wrap'
            }}>
              {this.state.error?.toString()}
            </div>

            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
