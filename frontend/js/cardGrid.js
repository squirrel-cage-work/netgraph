import { restApiDataFetcher } from './restApiFetcher.js';

// /{devices} API 
const apiUrlDevices = config.apiUrlDevices;

const cardContainers = document.querySelectorAll('.cardContainer');

const renderCardHtml = (title, count) => `
        <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <i class="fas fa-users fa-2x text-gray-400"></i>
                </div>
                <div class="ml-5 w-0 flex-1">
                    <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">
                            ${title}
                        </dt>
                        <dd>
                            <div class="text-lg font-medium text-gray-900">
                                ${count}
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
`

async function updateCardContiners () {

    // initial loading
    for (const cardContainer of cardContainers) {
        const cardTitle = cardContainer.getAttribute('cardTitle');
        cardContainer.innerHTML = renderCardHtml(cardTitle, 'Loading...');
    }

    // loading
    for (const cardContainer of cardContainers) {

        const cardTitle  = cardContainer.getAttribute('cardTitle');
        const deviceKind = cardContainer.getAttribute('deviceKind');
        let deviceCount  = '';

        // /{devices} API
        const restApiFetcher = new restApiDataFetcher(apiUrlDevices + deviceKind);

        try {
            const apiResp = await restApiFetcher.getData();
            if (!apiResp.ok) {
                throw new Error(`HTTP error! status: ${apiResp.status}`);
            }
            const apiRespjson = await apiResp.json();
            deviceCount = apiRespjson.length;
        } catch (error) {
            console.error('Fetch GET error:', error);
            deviceCount = 'Error loading data';
        }

        cardContainer.innerHTML = renderCardHtml(cardTitle, deviceCount);
    }
}

updateCardContiners();