import { useUser, SignOutButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export const HomeScreen = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/create');
  };

  return (
    <div className="home-screen">
      <aside className="sidebar">
        <div className="user-profile">
          <div className="avatar">
            {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0]}
          </div>
          <div className="user-info">
            <span className="email">{user?.emailAddresses[0]?.emailAddress}</span>
          </div>
          <SignOutButton />
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
          <button className="create-new" onClick={handleCreateNew}>Create New</button>
        </header>
        <div className="content-grid">
          <div className="empty-state">
            <h2>No Memory Palaces Yet</h2>
            <p>Create your first memory palace to get started</p>
            <button className="create-new" onClick={handleCreateNew}>Create New Memory Palace</button>
          </div>
        </div>
      </main>
    </div>
  )
}
