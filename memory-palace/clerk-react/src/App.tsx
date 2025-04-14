import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { HomeScreen } from './components/home/HomeScreen';
import { CreateMemoryPalace } from './components/create/CreateMemoryPalace';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="logo">Memory Palace</div>
          <div className="auth-buttons">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </header>
        <main>
          <SignedIn>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/create" element={<CreateMemoryPalace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SignedIn>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
