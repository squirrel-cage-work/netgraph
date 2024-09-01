document.addEventListener("DOMContentLoaded", function() {

    const apiUrl = config.apiUrl;

    const userCountElement = document.getElementById('totalswitches');

    // APIからデータを取得
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // 取得したユーザー数を表示
            userCountElement.textContent = data.totalswitches;
        })
        .catch(error => {
            console.error('エラーが発生しました:', error);
            userCountElement.textContent = 'データを取得できませんでした';
        });
});