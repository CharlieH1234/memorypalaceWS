import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { HomeScreen } from './components/home/HomeScreen';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomeScreen />
      </ProtectedRoute>
    ),
  },
]);
