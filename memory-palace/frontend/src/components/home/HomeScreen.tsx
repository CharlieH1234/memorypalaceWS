import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/home.css';

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home-screen">
      <aside className="sidebar">
        <div className="user-profile">
          <div className="avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="email">{user?.email}</span>
          </div>
        </div>
        <nav className="navigation">
          <ul>
            <li className="active">
              <button>My Memory Palaces</button>
            </li>
            <li>
              <button>Recent</button>
            </li>
            <li>
              <button>Shared</button>
            </li>
            <li>
              <button>Templates</button>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="content-header">
          <h1>My Memory Palaces</h1>
          <button className="create-new">Create New</button>
        </header>
        
        <div className="content-grid">
          {/* Grid content will be added when we implement file management */}
          <div className="empty-state">
            <h2>No Memory Palaces Yet</h2>
            <p>Create your first memory palace to get started</p>
            <button className="create-new">Create New Memory Palace</button>
          </div>
        </div>
      </main>
    </div>
  );
};
