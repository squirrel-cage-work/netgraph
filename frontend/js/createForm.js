import { restApiDataFetcher } from './restApiFetcher.js';

const createFormContainer = document.getElementById('createFormContainer');
const createType = createFormContainer.getAttribute('createType');

const renderCreateFormHtml = (type) => `
<div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-bold mb-4">create new ${type}</h2>
    <form id="createNameForm" class="space-y-4">
        <div>
            <input type="text" id="createTypeName" placeholder="${type} name..."
                class="w-full px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded border border-gray-300 text-sm shadow focus:outline-none focus:ring focus:border-blue-300" required>
        </div>
        <div>
            <button type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                create
            </button>
        </div>
    </form>
</div>
`;

async function formApiRequest(type, value) {

    const apiUrls = {
        tenants: config.apiUrlTenantsTenantName,
        switches: config.apiUrlSwitchesDeviceName,
        routers: config.apiUrlRoutersDeviceName
    };
    const apiUrl = apiUrls[type] + value;

    // spinner and message
    const loadingHtml = `
    <div id="loading" class="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
        <div class="text-center">
            <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            <p class="text-lg text-gray-700 mt-4">api running...</p>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHtml);

    const restApiFetcher = new restApiDataFetcher(apiUrl);

    try {
        const apiResp = await restApiFetcher.postData();
        if (!apiResp.ok) {
            throw new Error(`HTTP error! status: ${apiResp.status}`);
        }
    } catch (error) {
        console.error('Fetch POST error:', error);
    } finally {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
}

// initial loading
createFormContainer.innerHTML = renderCreateFormHtml(createType);

// eventListner
createNameForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const createTypeValue = document.getElementById('createTypeName').value;
    const createNameForm  = document.getElementById('createNameForm');
    
    formApiRequest(createType, createTypeValue);
});