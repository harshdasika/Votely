// jest.setup.js
import '@testing-library/jest-dom';
import { MockFirebase } from 'firebase-mock';

// Set up Firebase mock
const mockAuth = new MockFirebase();
const mockFirestore = new MockFirebase();

global.firebase = {
    auth: () => mockAuth,
    firestore: () => mockFirestore,
};