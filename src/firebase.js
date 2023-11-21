import { initializeApp } from "firebase/app";
import {getDatabase} from 'firebase/database'
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyCH8KOSBvCPtYn7sFHsxhAGG5-92JFPqWg",
  authDomain: "todo-list-e19c3.firebaseapp.com",
  databaseURL: "https://todo-list-e19c3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todo-list-e19c3",
  storageBucket: "todo-list-e19c3.appspot.com",
  messagingSenderId: "355355108151",
  appId: "1:355355108151:web:a22bbf5ac0fdd6c96170b2"
};

const app = initializeApp(firebaseConfig);
export const db =getDatabase(app)
export const auth=getAuth()
