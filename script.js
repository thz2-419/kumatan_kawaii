// 1. Firebaseから必要なツールを読み込む（HTMLの最後で読み込む方法もあります）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. あなたのFirebase設定（ステップ1でメモしたものに書き換えてください）
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCH-MgINdvD47RF8-YCiZxz-FXM2GtiC9Y",
  authDomain: "kuma-8b55b.firebaseapp.com",
  projectId: "kuma-8b55b",
  storageBucket: "kuma-8b55b.firebasestorage.app",
  messagingSenderId: "862830358024",
  appId: "1:862830358024:web:3817ed08d5353df89c2bbd",
  measurementId: "G-2YV2GSXYD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 3. 初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsRef = collection(db, "posts");

// 4. 投稿する関数（HTMLのbuttonから呼び出す）
window.addPost = async () => {
    const name = document.getElementById('input-name').value;
    const message = document.getElementById('input-message').value;

    if (name && message) {
        await addDoc(postsRef, {
            name: name,
            message: message,
            timestamp: serverTimestamp() // 送信時間を記録
        });
        document.getElementById('input-message').value = ""; // メッセージだけ空にする
    }
};

// 5. データベースの更新を「リアルタイム」で監視して画面に表示
const q = query(postsRef, orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
    const postArea = document.getElementById('post-area');
    postArea.innerHTML = ""; // 一旦クリア
    snapshot.forEach((doc) => {
        const data = doc.data();
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `<strong>${data.name}</strong><p>${data.message}</p>`;
        postArea.appendChild(postDiv);
    });
});