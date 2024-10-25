
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getFirestore, doc, getDoc, setDoc, collection } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging.js";

// Votely Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf49wkzv5cI2ymZX4s2_PpNPq_8c9PGqU",
  authDomain: "votely-492k.firebaseapp.com",
  projectId: "votely-492k",
  storageBucket: "votely-492k.appspot.com",
  messagingSenderId: "460551904614",
  appId: "1:460551904614:web:a93225f7d674fb651abca7",
  measurementId: "G-XSDFNR8YK0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const db = getFirestore(app);
const messaging = getMessaging(app);
const provider = new GoogleAuthProvider();

const loginButton = document.getElementById('googleSignInButton');

loginButton.addEventListener('click', () => {
    signInWithPopup(auth, provider)
    .then(async (result) => {
        const user = result.user
        console.log("Signed in:", user.displayName, user.email);

        const userDocReference = doc(db, "User", user.uid);
        const userDocSnap = await getDoc(userDocReference);
        if (userDocSnap.exists()) {
            console.log("User already in database:", userDocSnap.data());
            window.location.href = "userDash.html"
        } else {
            await setDoc(userDocReference, {
                name: user.displayName,
                email: user.email,
                profile_image_url: user.photoURL,
                createdAt: new Date(),
                user_id: user.uid
            });
            console.log("New user added:", user.displayName, user.email);
        }
        window.location.href = "userDash.html";
    }).catch((error) => {
        console.error('Error during sign-in:', error.code, error.message)
    })
    
});