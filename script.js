// 1. Firebaseから必要なツールを読み込む（HTMLの最後で読み込む方法もあります）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. あなたのFirebase設定（ステップ1でメモしたものに書き換えてください）
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

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