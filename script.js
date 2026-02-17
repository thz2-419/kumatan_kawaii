// 1. Firebaseから必要なツールを読み込む（HTMLの最後で読み込む方法もあります）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


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

function getOrCreateUserID() {
    let uid = localStorage.getItem('kuma_user_id');
    if (!uid) {
        // 初めての人にはランダムなID（例：ID-12345）を作る
        uid = 'ID-' + Math.floor(Math.random() * 100000);
        localStorage.setItem('kuma_user_id', uid);
    }
    return uid;
}

// --- 2. 投稿する関数を修正 ---
window.addPost = async () => {
    const name = document.getElementById('input-name').value;
    const message = document.getElementById('input-message').value;
    const userID = getOrCreateUserID(); // ここでIDを取得（ユーザーは操作不能）

    if (name && message) {
        await addDoc(postsRef, {
            name: name,
            message: message,
            userID: userID, // IDをデータベースに保存
            timestamp: serverTimestamp()
        });
        document.getElementById('input-message').value = "";
    }
};

onSnapshot(q, (snapshot) => {
    const postArea = document.getElementById('post-area');
    postArea.innerHTML = "";
    snapshot.forEach((doc) => {
        const data = doc.data();
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        // HTMLの中にIDを表示する場所を作る
        postDiv.innerHTML = `
            <small style="color: #888;">${data.userID || '不明'}</small><br>
            <strong>${data.name}</strong>
            <p>${data.message}</p>
        `;
        postArea.appendChild(postDiv);
    });
});

// --- 1. 初期設定（ページ読み込み時に実行） ---
function initUser() {
    const savedName = localStorage.getItem('kuma_user_name');
    const nameReg = document.getElementById('name-registration');
    const msgArea = document.getElementById('message-area');
    const displayName = document.getElementById('display-user-name');

    if (savedName) {
        // 名前がある場合：メッセージ入力欄を表示
        nameReg.style.display = 'none';
        msgArea.style.display = 'block';
        displayName.innerText = savedName;
    } else {
        // 名前がない場合：登録画面を表示
        nameReg.style.display = 'block';
        msgArea.style.display = 'none';
    }
}

// --- 2. 名前をブラウザに登録する関数 ---
window.registerName = () => {
    const name = document.getElementById('input-name').value;
    if (!name) return alert("名前を入力してね！");
    
    localStorage.setItem('kuma_user_name', name);
    initUser(); // 画面を切り替え
};

// --- 3. 投稿する関数（名前をlocalStorageから取得） ---
window.addPost = async () => {
    const message = document.getElementById('input-message').value;
    const name = localStorage.getItem('kuma_user_name'); // 保存された名前を使う
    const userID = getOrCreateUserID();

    if (message) {
        await addDoc(postsRef, {
            name: name,
            message: message,
            userID: userID,
            timestamp: serverTimestamp()
        });
        document.getElementById('input-message').value = "";
    }
};

// 名前をリセットしたい時用
window.resetUser = () => {
    if(confirm("名前を登録し直しますか？")) {
        localStorage.removeItem('kuma_user_name');
        initUser();
    }
};

// 起動時に実行
initUser();