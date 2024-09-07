async function loadMenu() {
    try {
        const response = await fetch('menu.html');
        const data = await response.text();
        document.getElementById('menu-container').innerHTML = data;
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}
loadMenu();
