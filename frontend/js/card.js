const cardContainer = document.querySelectorAll('.cardContainer');


cardContainer.forEach(cardContainer => {
    const cardTitle = cardContainer.getAttribute('cardTitle');
    const cardValue = cardContainer.getAttribute('cardValue');

    const cardHtml = `
        <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <i class="fas fa-users fa-2x text-gray-400"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                    <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">
                            ${cardTitle}
                        </dt>
                        <dd>
                            <div class="text-lg font-medium text-gray-900">
                                ${cardValue}
                            </div>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                    sample
                </a>
            </div>
        </div>
    </div>
    `;

    cardContainer.innerHTML = cardHtml;

});