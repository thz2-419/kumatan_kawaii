function addPost() {
    const name = document.getElementById("input-name").value;
    const message = document.getElementById("input-message").value;
    if (name === "" || message === "") {

        alert("名前とメッセージを入力してください");
        return;
    }
 const postDiv = document.createElement("div");
    postDiv.className= 'post';

    postDiv.innerHTML = `<strong>${name}</strong><p>${message}</p>`;
    const postArea = document.getElementById('post-area');
    postArea.prepend(postDiv);

    document.getElementById("input-name").value = "";
    document.getElementById("input-message").value = "";
}  