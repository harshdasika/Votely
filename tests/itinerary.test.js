// itinerary.test.js
import { getAuth, getDoc, setDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
    getAuth: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    getDocs: jest.fn(),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    serverTimestamp: jest.fn(() => 'mock_timestamp'),
}));

const auth = { currentUser: { uid: 'test_user_id', email: 'test@example.com' } };
getAuth.mockReturnValue(auth);

// Mocking the `createItinerary` function
async function createItinerary(groupID, title, description) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User not authenticated.');
    }

    if (!title || !description) {
        throw new Error('Title and description are required.');
    }

    try {
        const userDoc = await getDoc({}); // Mocked `getDoc`
        const userName = userDoc.exists() ? userDoc.data().name : 'Unknown User';

        await setDoc(
            {},
            {
                card_id: Math.random().toString(36).substring(2, 12),
                group_id: groupID,
                title,
                description,
                proposed_by: userName,
                created_at: serverTimestamp(),
            },
            { merge: true }
        );

        return 'Itinerary created successfully';
    } catch (error) {
        throw new Error(`Error creating itinerary: ${error.message}`);
    }
}

// Mocking the `fetchItineraries` function
async function fetchItineraries(groupID) {
    try {
        const querySnapshot = await getDocs({
            forEach: (callback) => {
                callback({
                    id: 'itinerary_1',
                    data: () => ({
                        title: 'Sample Itinerary',
                        description: 'Sample Description',
                        Yes_Votes: [],
                        No_Votes: [],
                    }),
                });
            },
            empty: false,
        });

        const itineraries = [];
        querySnapshot.forEach((doc) => {
            itineraries.push({ id: doc.id, ...doc.data() });
        });

        return itineraries;
    } catch (error) {
        throw new Error(`Error fetching itineraries: ${error.message}`);
    }
}

// Tests for createItinerary
describe('createItinerary', () => {
    test('successfully creates an itinerary', async () => {
        setDoc.mockResolvedValueOnce();

        getDoc.mockResolvedValueOnce({
            exists: () => true,
            data: () => ({ name: 'Test User' }),
        });

        const result = await createItinerary('test_group_id', 'Sample Title', 'Sample Description');
        expect(result).toBe('Itinerary created successfully');
        expect(setDoc).toHaveBeenCalledWith(
            expect.any(Object),
            expect.objectContaining({
                title: 'Sample Title',
                description: 'Sample Description',
                group_id: 'test_group_id',
                proposed_by: 'Test User',
                created_at: 'mock_timestamp',
            }),
            { merge: true }
        );
    });

    test('System throws an error if title or description is missing', async () => {
        await expect(createItinerary('test_group_id', '', 'Sample Description')).rejects.toThrow(
            'Title and description are required.'
        );
        await expect(createItinerary('test_group_id', 'Sample Title', '')).rejects.toThrow(
            'Title and description are required.'
        );
    });

    test('handles Firestore errors', async () => {
        getDoc.mockRejectedValueOnce(new Error('Firestore error')); // Simulate Firestore error
        setDoc.mockResolvedValueOnce(); // Ensure other Firestore interactions are still mocked correctly
    
        await expect(createItinerary('test_group_id', 'Sample Title', 'Sample Description')).rejects.toThrow(
            'Error creating itinerary: Firestore error'
        );
    });
    
});

// Tests for fetchItineraries
describe('fetchItineraries', () => {
    test('successfully fetches itineraries', async () => {
        getDocs.mockResolvedValueOnce({
            forEach: (callback) => {
                callback({
                    id: 'itinerary_1',
                    data: () => ({
                        title: 'Sample Itinerary',
                        description: 'Sample Description',
                        Yes_Votes: [],
                        No_Votes: [],
                    }),
                });
            },
            empty: false,
        });

        const itineraries = await fetchItineraries('test_group_id');
        expect(itineraries).toEqual([
            {
                id: 'itinerary_1',
                title: 'Sample Itinerary',
                description: 'Sample Description',
                Yes_Votes: [],
                No_Votes: [],
            },
        ]);
    });

    test('groupDash handles cases where no itineraries exist', async () => {
        getDocs.mockResolvedValueOnce({
            forEach: () => {},
            empty: true,
        });

        const itineraries = await fetchItineraries('test_group_id');
        expect(itineraries).toEqual([]);
    });

    test('System handles Firestore errors gracefully', async () => {
        getDocs.mockRejectedValueOnce(new Error('Firestore error'));

        await expect(fetchItineraries('test_group_id')).rejects.toThrow('Error fetching itineraries: Firestore error');
    });
});