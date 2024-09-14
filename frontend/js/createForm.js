import { restApiDataFetcher } from './restApiFetcher.js';

const createFormContainer = document.getElementById('createFormContainer');
const createType = createFormContainer.getAttribute('createType');

// insert create form html

const createFormHtml = `
<div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-bold mb-4">create new ${createType}</h2>
    <form id="createNameForm" class="space-y-4">
        <div>
            <input type="text" id="createTypeName" placeholder="${createType} name..."
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
`
createFormContainer.innerHTML = createFormHtml;

// handle form submission for creating a type name

const createNameForm = document.getElementById('createNameForm');

createNameForm.addEventListener('submit',  async function(event) {
    event.preventDefault();

    const createTypeNameValue = document.getElementById('createTypeName').value;

    // tenant dashboard
    if (createType == 'tenant') {
        const apiUrlTenantsTenantName = config.apiUrlTenantsTenantName;
        const restApiFetcher = new restApiDataFetcher(apiUrlTenantsTenantName + createTypeNameValue);
        const apiResp = await restApiFetcher.postData();

        alert('success !!')
        createNameForm.reset();
    }

});


/*
const apiUrlTenantsTenantName = config.apiUrlTenantsTenantName;
const restApiFetcher = new restApiDataFetcher()

const createFormContainer = document.getElementById('createFormContainer');



const updateCreateFormContainer = async () => {

}

<div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-bold mb-4">Create new switch</h2>
    <form id="tenantForm" class="space-y-4">
        <div>
            <label for="switchName" class="block text-sm font-medium text-gray-700">Switch Name</label>
            <input type="text" id="switchName" name="switchName"
                class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required>
        </div>
        <div>
            <button type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create
            </button>
        </div>
    </form>
</div>
*/