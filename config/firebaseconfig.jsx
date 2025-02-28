// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDqR_kxHmI1Gb02hYL7EhbbglW4xozHWfQ",
//   authDomain: "studymate-672b2.firebaseapp.com",
//   projectId: "studymate-672b2",
//   storageBucket: "studymate-672b2.firebasestorage.app",
//   messagingSenderId: "821309269942",
//   appId: "1:821309269942:web:2bbd3fc634dca1c6938317",
//   measurementId: "G-76WVJ7BFRJ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqR_kxHmI1Gb02hYL7EhbbglW4xozHWfQ",
  authDomain: "studymate-672b2.firebaseapp.com",
  projectId: "studymate-672b2",
  storageBucket: "studymate-672b2.firebasestorage.app",
  messagingSenderId: "821309269942",
  appId: "1:821309269942:web:2bbd3fc634dca1c6938317",
  measurementId: "G-76WVJ7BFRJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
