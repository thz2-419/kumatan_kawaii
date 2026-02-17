import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCH-MgINdvD47RF8-YCiZxz-FXM2GtiC9Y",
    authDomain: "kuma-8b55b.firebaseapp.com",
    projectId: "kuma-8b55b",
    storageBucket: "kuma-8b55b.firebasestorage.app",
    messagingSenderId: "862830358024",
    appId: "1:862830358024:web:3817ed08d5353df89c2bbd",
    measurementId: "G-2YV2GSXYD2"
};

// 初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsRef = collection(db, "posts");

// --- IDと名前の管理関数 ---
function getOrCreateUserID() {
    let uid = localStorage.getItem('kuma_user_id');
    if (!uid) {
        uid = 'ID-' + Math.floor(Math.random() * 100000);
        localStorage.setItem('kuma_user_id', uid);
    }
    return uid;
}

function initUser() {
    const savedName = localStorage.getItem('kuma_user_name');
    const nameReg = document.getElementById('name-registration');
    const msgArea = document.getElementById('message-area');
    const displayName = document.getElementById('display-user-name');

    if (savedName && nameReg && msgArea) {
        nameReg.style.display = 'none';
        msgArea.style.display = 'block';
        displayName.innerText = savedName;
    } else if (nameReg && msgArea) {
        nameReg.style.display = 'block';
        msgArea.style.display = 'none';
    }
}

// --- ボタンから呼ばれる関数 ---
window.registerName = () => {
    const name = document.getElementById('input-name').value;
    if (!name) return alert("名前を入力してね！");
    localStorage.setItem('kuma_user_name', name);
    initUser();
};

window.addPost = async () => {
    const message = document.getElementById('input-message').value;
    const name = localStorage.getItem('kuma_user_name');
    const userID = getOrCreateUserID();

    if (message && name) {
        await addDoc(postsRef, {
            name: name,
            message: message,
            userID: userID,
            timestamp: serverTimestamp()
        });
        document.getElementById('input-message').value = "";
    }
};

window.resetUser = () => {
    if(confirm("名前を登録し直しますか？")) {
        localStorage.removeItem('kuma_user_name');
        initUser();
    }
};

// --- リアルタイム表示（時間表示ありVer） ---
const q = query(postsRef, orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
    const postArea = document.getElementById('post-area');
    if (!postArea) return;
    postArea.innerHTML = ""; 
    
    snapshot.forEach((doc) => {
        const data = doc.data();
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        // 時間の計算
        let timeString = "送信中...";
        if (data.timestamp) {
            const date = data.timestamp.toDate();
            timeString = date.toLocaleString('ja-JP', {
                month: 'numeric', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        }

        postDiv.innerHTML = `
            <div class="post-header" style="display: flex; justify-content: space-between; font-size: 0.8em; color: #888;">
                <span>${data.userID || '不明'}</span>
                <span>${timeString}</span>
            </div>
            <strong>${data.name}</strong>
            <p>${data.message}</p>
        `;
        postArea.appendChild(postDiv);
    });
});

// 起動
initUser();