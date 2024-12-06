// voting.test.js
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Mock Firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'test_user_id' }, // Mock authenticated user
  })),
}));

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    doc: jest.fn((_, collection, id) => ({ collection, id })),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
  };
});

async function voteOnItinerary(cardID, groupId, voteType) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error('User not authenticated.');

  const itineraryDocRef = doc({}, 'ItineraryCard', cardID);
  const docSnapshot = await getDoc(itineraryDocRef);

  if (!docSnapshot.exists()) throw new Error('Itinerary card not found.');

  const data = docSnapshot.data();
  const yesVotes = data.Yes_Votes || [];
  const noVotes = data.No_Votes || [];

  if (voteType === 'yes') {
    if (!yesVotes.includes(user.uid)) yesVotes.push(user.uid);
    const index = noVotes.indexOf(user.uid);
    if (index > -1) noVotes.splice(index, 1);
  } else if (voteType === 'no') {
    if (!noVotes.includes(user.uid)) noVotes.push(user.uid);
    const index = yesVotes.indexOf(user.uid);
    if (index > -1) yesVotes.splice(index, 1);
  }

  await setDoc(itineraryDocRef, { Yes_Votes: yesVotes, No_Votes: noVotes }, { merge: true });
  return `Vote ${voteType} updated successfully.`;
}

// Tests
describe('voteOnItinerary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('User successfully casts a Yes vote', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ Yes_Votes: [], No_Votes: [] }),
    });

    setDoc.mockResolvedValueOnce();

    const result = await voteOnItinerary('card_123', 'group_123', 'yes');

    expect(result).toBe('Vote yes updated successfully.');
    expect(setDoc).toHaveBeenCalledWith(
      { collection: 'ItineraryCard', id: 'card_123' },
      { Yes_Votes: ['test_user_id'], No_Votes: [] },
      { merge: true }
    );
  });

  test('Firestore removes user from No votes when casting Yes vote', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ Yes_Votes: [], No_Votes: ['test_user_id'] }),
    });

    setDoc.mockResolvedValueOnce();

    const result = await voteOnItinerary('card_123', 'group_123', 'yes');

    expect(result).toBe('Vote yes updated successfully.');
    expect(setDoc).toHaveBeenCalledWith(
      { collection: 'ItineraryCard', id: 'card_123' },
      { Yes_Votes: ['test_user_id'], No_Votes: [] },
      { merge: true }
    );
  });

  test('System throws error if user is not authenticated', async () => {
    getAuth.mockReturnValueOnce({ currentUser: null });

    await expect(voteOnItinerary('card_123', 'group_123', 'yes')).rejects.toThrow(
      'User not authenticated.'
    );
  });

  test('System throws error if itinerary card does not exist', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });

    await expect(voteOnItinerary('invalid_card_id', 'group_123', 'yes')).rejects.toThrow(
      'Itinerary card not found.'
    );
  });
});
