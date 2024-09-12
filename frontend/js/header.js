const headerContainer = document.getElementById('headerContainer');
const headerTitle = headerContainer.getAttribute('headerTitle');

const headerHtml = `
<header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">${headerTitle}</h1>
    </div>
</header>
`;

headerContainer.innerHTML = headerHtml;