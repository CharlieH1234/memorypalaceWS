import React from 'react';
import { supabase } from '../../services/supabase/config';

export const AppShell = () => {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>Memory Palace</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="card">
            <h2>Environment Information</h2>
            <div className="info-row">
              <div className="info-label">Supabase URL:</div>
              <div className="info-value code">{import.meta.env.VITE_SUPABASE_URL}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Environment:</div>
              <div className="info-value">
                <span className="badge badge-success">{import.meta.env.MODE}</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Connection Status:</div>
              <div className="info-value">
                <ConnectionStatus />
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="card">
            <h2>Application Status</h2>
            <div className="info-row">
              <div className="info-label">Frontend Version:</div>
              <div className="info-value code">1.0.0</div>
            </div>
            <div className="info-row">
              <div className="info-label">React Version:</div>
              <div className="info-value code">{React.version}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ConnectionStatus = () => {
  const [status, setStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');

  React.useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      if (error) throw error;
      setStatus('connected');
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('error');
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'connected':
        return 'badge-success';
      case 'error':
        return 'badge-error';
      default:
        return 'badge-warning';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      default:
        return 'Checking...';
    }
  };

  return <span className={`badge ${getStatusClass()}`}>{getStatusText()}</span>;
};
