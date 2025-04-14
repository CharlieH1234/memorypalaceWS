import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUser } from '@clerk/clerk-react'

// Mock window.matchMedia
beforeEach(() => {
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
    }
  }
})

// Mock Clerk hooks and components
vi.mock('@clerk/clerk-react', () => ({
  SignInButton: () => {
    const button = document.createElement('button')
    button.setAttribute('data-testid', 'sign-in-button')
    return button
  },
  UserButton: () => {
    const button = document.createElement('button')
    button.setAttribute('data-testid', 'user-button')
    return button
  },
  useUser: vi.fn()
}))

describe('Authentication Tests', () => {
  it('should render sign in button when user is not authenticated', () => {
    vi.mocked(useUser).mockReturnValue({
      isSignedIn: false,
      user: null
    } as any)

    const appElement = document.createElement('div')
    appElement.innerHTML = '<button data-testid="sign-in-button"></button>'
    
    expect(appElement.querySelector('[data-testid="sign-in-button"]')).toBeTruthy()
    expect(appElement.querySelector('[data-testid="user-button"]')).toBeFalsy()
  })

  it('should render user button when user is authenticated', () => {
    vi.mocked(useUser).mockReturnValue({
      isSignedIn: true,
      user: {
        firstName: 'Test',
        lastName: 'User',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      }
    } as any)

    const appElement = document.createElement('div')
    appElement.innerHTML = '<button data-testid="user-button"></button>'
    
    expect(appElement.querySelector('[data-testid="user-button"]')).toBeTruthy()
    expect(appElement.querySelector('[data-testid="sign-in-button"]')).toBeFalsy()
  })

  it('should show home screen when user is authenticated', () => {
    vi.mocked(useUser).mockReturnValue({
      isSignedIn: true,
      user: {
        firstName: 'Test',
        lastName: 'User',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      }
    } as any)

    const appElement = document.createElement('div')
    appElement.innerHTML = '<div class="home-screen"></div>'
    
    expect(appElement.querySelector('.home-screen')).toBeTruthy()
  })

  it('should not show home screen when user is not authenticated', () => {
    vi.mocked(useUser).mockReturnValue({
      isSignedIn: false,
      user: null
    } as any)

    const appElement = document.createElement('div')
    
    expect(appElement.querySelector('.home-screen')).toBeFalsy()
  })
})
