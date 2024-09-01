import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5WCrJ0fhGWcHI6sr7AcE8YFmH-fG4JV0",
  authDomain: "btp-allocator.firebaseapp.com",
  projectId: "btp-allocator",
  storageBucket: "btp-allocator.appspot.com",
  messagingSenderId: "839985700909",
  appId: "1:839985700909:web:a057d63d880c6e6fa198a4",
  measurementId: "G-MPEFLZWCVJ"
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;