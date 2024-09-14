import { restApiDataFetcher } from './restApiFetcher.js';

const createTableContainer = document.getElementById('createTableContainer');
const createType = createTableContainer.getAttribute('createType');

// create table 
const createTableHtml = `
<h2 class="text-lg font-bold mb-4 flex items-center">
    ${createType} list
    <!-- アイコンボタン -->
    <button id="reloadButton" class="ml-4 p-1 text-white bg-green-600 hover:bg-green-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center">
        <i class="fas fa-sync-alt text-xs"></i>
    </button>
</h2>
<!--
<div class="mb-4">
    <input type="text" id="searchSwitch" placeholder="Search switches..."
        class="w-full px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:border-blue-300">
</div>
-->
<div class="overflow-x-auto">
    <table class="min-w-full table-fixed divide-gray-200">
        <!-- insert thread from javascript -->
        <thead id="tableHead" class="bg-gray-50"></thead>
        <!-- insert tbody from javascript -->
        <tbody id="tableBody" class="bg-white divide-y divide-gray-200">
        </tbody>
    </table>
</div>
`
createTableContainer.innerHTML = createTableHtml;

// create columns and items from api
let columns = [];
let items =[];

const apiUrl = config.apiUrlDevices;
const apiUrlTenantsTenantName = config.apiUrlTenantsTenantName;

if (createType == 'tenants') {
    try {
        const restApiFetcher = new restApiDataFetcher(apiUrl + createType);
        const apiResp = await restApiFetcher.getData();
        const apiRespjson = await apiResp.json();

        columns = [
            { key: 'tenantName'},
            { key: 'actions'}
        ]

        for (let i = 0; i < apiRespjson.length; i++) {
            items.push({'tenantName': apiRespjson[i].deviceName});
        }

        console.log(columns);
        console.log(items);

    } catch (error) {
        columns = [
            { key: 'tenantName'},
            { key: 'tenantName'},
            { key: 'tenantName'},
            { key: 'tenantName'},
            { key: 'actions'}
        ];
        items = [
            { tenantName: 'UserA'},
            { tenantName: 'UserB'},
            { tenantName: 'UserC'},
            { tenantName: 'UserD'},
            { tenantName: 'UserE'},
            { tenantName: 'UserF'},
            { tenantName: 'UserG'},
            { tenantName: 'UserH'},
            { tenantName: 'UserI'},
            { tenantName: 'UserJ'},
            { tenantName: 'UserK'},
        ];
    }
}

// create table header from columns object
function createTableHeader(columns) {
    const tableHead = document.getElementById('tableHead');
    const tableHeadRow = document.createElement('tr');

    tableHead.innerHTML = '';

    columns.forEach(column => {
        const headerHeadColumn = document.createElement('th');
        headerHeadColumn.classList.add('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider');
        headerHeadColumn.style.width = `${100 / columns.length}%`;
        headerHeadColumn.innerHTML = column.key;
        tableHeadRow.appendChild(headerHeadColumn);
    });

    tableHead.appendChild(tableHeadRow);
}

// pagination logic
const paginationHtml = `
<div id="paginationContainer" class="mt-4 flex justify-between items-center">
    <button id="prevPage" class="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled>
        Previous
    </button>
    <span id="pageInfo" class="text-sm text-gray-700">Page 1 of 1</span>
    <button id="nextPage" class="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled>
        Next
    </button>
</div>
`;
createTableContainer.insertAdjacentHTML('beforeend', paginationHtml);

const itemsPerPage = 5;
let currentPage = 1;

function updateTable(items, columns) {

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    createTableBody(paginatedItems, columns);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateTable(items,columns);
        showPopup ();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateTable(items,columns);
        showPopup ();
    }
});

// create table body from columuns and data objects
function createTableBody(items, columns) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    items.forEach(item => {

        const tableBodyRow = document.createElement('tr');

        columns.forEach(column => {

            if (column.key == 'actions') {
                                
                const select = document.createElement('select');
                select.classList.add('formSelect');
                select.setAttribute('name', Object.values(item)[0]);

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select action';
                select.appendChild(defaultOption);

                /*
                const updateOption = document.createElement('option');
                updateOption.value = 'update';
                updateOption.textContent = 'Update';
                select.appendChild(updateOption);
                */

                const deleteOption = document.createElement('option');
                deleteOption.value = 'delete';
                deleteOption.textContent = 'Delete';
                select.appendChild(deleteOption);

                const tableBodyCell = document.createElement('td');
                tableBodyCell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');
                tableBodyCell.style.width = `${100 / columns.length}%`;
                
                tableBodyCell.appendChild(select);
                tableBodyRow.appendChild(tableBodyCell);   

            } else {
                const tableBodyCell = document.createElement('td');
                tableBodyCell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-500');
                tableBodyCell.style.width = `${100 / columns.length}%`;

                tableBodyCell.innerHTML = item[column.key];

                tableBodyRow.appendChild(tableBodyCell);    
            }
        });
        tableBody.appendChild(tableBodyRow);
    });
}

// create popup

function showPopup () {
    const formSelect = document.querySelectorAll('.formSelect');

    formSelect.forEach(select => {
        select.addEventListener("change", async function(event) {
            if (event.target.value == 'delete') {
                showDeletePopup(event.target.name);
            }
        });
    });
}

async function showDeletePopup(targetName) {
    const popup = document.createElement('div');
    popup.classList.add('fixed', 'inset-0', 'bg-gray-600', 'bg-opacity-50', 'overflow-y-auto', 'h-full', 'w-full', 'flex', 'items-center', 'justify-center');
    popup.innerHTML = `
    <div class="bg-white p-5 rounded-lg shadow-xl">
        <h2 class="text-xl mb-4">Delete Tenant</h2>
        <p class="mb-4">Are you sure you want to delete ${targetName} ?</p>
        <div class="flex justify-end">
            <button id="cancelDelete" class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2">Cancel</button>
            <button id="confirmDelete" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
        </div>
    </div>
    `;
    document.body.appendChild(popup);
    
    document.getElementById('cancelDelete').addEventListener('click', function () {
        document.body.removeChild(popup);
        updateTable(items, columns);
        showPopup ();
    });

    document.getElementById('confirmDelete').addEventListener('click', async function () {

        try {
            const restApiFetcher = new restApiDataFetcher(apiUrlTenantsTenantName + targetName);
            const apiResp = await restApiFetcher.deleteData();
            
        } catch (error) {
            alert(error);
        }

        document.body.removeChild(popup);
        updateTable(items, columns);
        showPopup ();
    });
};

// reload
document.getElementById('reloadButton').addEventListener('click', async () => {
    if (createType == 'tenants') {
        try {
            const restApiFetcher = new restApiDataFetcher(apiUrl + createType);
            const apiResp = await restApiFetcher.getData();
            const apiRespjson = await apiResp.json();
    
            columns = [
                { key: 'tenantName'},
                { key: 'actions'}
            ]
    
            for (let i = 0; i < apiRespjson.length; i++) {
                items.push({'tenantName': apiRespjson[i].deviceName});
            }
        } catch (error) {
            
        }
    }
    currentPage = 1; // Reset to the first page
    createTableHeader(columns);
    updateTable(items, columns);
    showPopup();
});

// Initial loaded
createTableHeader(columns);
updateTable(items, columns);
showPopup ();