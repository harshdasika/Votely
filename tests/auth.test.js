// tests/auth.test.js
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    signInWithPopup: jest.fn(),
    GoogleAuthProvider: jest.fn(),
  signOut: jest.fn(),
}));

describe('Firebase Authentication', () => {
    test('User should login with Google', async () => {
        const mockUser = { uid: '123', displayName: 'Test User' };

        // Mock signInWithPopup with the mock user
        signInWithPopup.mockResolvedValueOnce({ user: mockUser });
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        // Check if user returned is mock user
        expect(result.user.displayName).toBe('Test User');
        expect(result.user.uid).toBe('123');

        // Verify signInWithPopup was called once
        expect(signInWithPopup).toHaveBeenCalledTimes(1);
    });
  
    test('User should be able to logout', async () => {
        const auth = getAuth();
    
        signOut.mockResolvedValueOnce();
    
        await signOut(auth);
        expect(signOut).toHaveBeenCalledTimes(1);
      });
  });