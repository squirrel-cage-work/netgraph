document.addEventListener("DOMContentLoaded", function () {
    
    const switchesDeviceNameInterfacesApiUrl = config.switchesDeviceNameInterfacesApiUrl;

    // fetch query parameter
    const queryString = window.location.search;
    const params      = new URLSearchParams(queryString);

    const deviceName  = params.get('deviceName');
    const interfacesListHtml  = document.getElementById('interfacesListHtml');

    // Replace h1
    let h1Element = document.getElementById('h1-container');
    h1Element.innerHTML = `<h1 class="text-2xl font-bold mb-4">Interfaces for ${deviceName}</h1>`

    loadInitialData();

    // Interface リストの取得
    async function loadInitialData () {

        let interfacesList = '';

        function transformData(data) {
            let result = [];
            for (let i = 0; i < data.length; i++){
                let item = data[i];
                let tenantName = '';

                if (item.properties.tenant){
                    tenantName = item.properties.tenant
                }

                result.push ({
                    interfaceType: item.properties.interfaceType,
                    interfaceNumber: item.properties.interfaceNumber,
                    tenantName: tenantName
                });
            }
            return result;
        }

        try {
            const response = await fetch(switchesDeviceNameInterfacesApiUrl + '/' + deviceName + '/interfaces', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const apiResponse  = await response.json();
            interfacesListBody = transformData(apiResponse);

        } catch (e) {
            alert('Failed to load initial data from API', e);
            interfacesListBody = [
                { interfaceType: 'Error!!', interfaceNumber: 'Error!!', tenantName: 'Error!!'},
                { interfaceType: 'Error!!', interfaceNumber: 'Error!!', tenantName: 'Error!!'}
            ];
        }
        interfacesListBody.forEach(interfaceData => interfaceList(interfaceData));
    }

    function interfaceList(interfaceData) {
        const table = document.createElement('tr');
        table.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${deviceName}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${interfaceData.interfaceType}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${interfaceData.interfaceNumber}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${interfaceData.tenantName || ''}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <select class="form-select text-gray-600" data-interface-number="${interfaceData.interfaceNumber}" data-tenant-name="${interfaceData.tenantName || ''}" data-interface-type="${interfaceData.interfaceType}">
                  <option value="">Select Action</option>
                  <option value="delete">Delete</option>
              </select>
          </td>
        `;
        interfacesListHtml.appendChild(table);
    }



    // Replace deviceNameInput to deviceName
    const deviceNameInput = document.getElementById('deviceNameInput');
    deviceNameInput.value = deviceName;

    // Add table when clicked
    document.getElementById('addInterface').addEventListener('click', function () {
        createInterfaceInput();
    });

    const interfacesContainer = document.getElementById('interfacesContainer');
    let interfaceIndex = 0;

    window.removeInterface = function(button) {
        button.closest('tr').remove();
    }

    function createInterfaceInput() {
        interfaceIndex++;
        const row = document.createElement('tr');
        row.className = 'bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                <input type="text" id="interfaceType${interfaceIndex}" name="interfaceType${interfaceIndex}" class="w-full px-2 py-1 placeholder-gray-400 text-gray-700 bg-white rounded border border-gray-300 text-sm shadow focus:outline-none focus:ring focus:border-blue-300" required>
            </td>
            <td class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                <input type="text" id="interfaceNumber${interfaceIndex}" name="interfaceNumber${interfaceIndex}" class="w-full px-2 py-1 placeholder-gray-400 text-gray-700 bg-white rounded border border-gray-300 text-sm shadow focus:outline-none focus:ring focus:border-blue-300" required>
            </td>
            <td class="px-6 py-2 whitespace-nowrap text-center">
                <input type="checkbox" id="tag${interfaceIndex}" name="tag${interfaceIndex}" class="mt-1">
            </td>
            <td class="px-6 py-2 text-right">
                <button type="button" class="text-red-500 hover:text-red-700 delete-button" onclick="removeInterface(this)">Delete</button>
            </td>
        `;
        interfacesContainer.appendChild(row);
    }

    function clearInterfaceInput() {
        let addInterface = document.getElementById('interfacesContainer');
        addInterface.innerHTML = ``
    };

    // create json body
    document.getElementById('createInterfaceForm').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const formData  = new FormData(event.target);
        let requestBody = [];

        for (let i = 1; i <= interfaceIndex; i++){

            let interfaceType   = formData.get(`interfaceType${i}`);
            let interfaceNumber = formData.get(`interfaceNumber${i}`);
            let tagCheckbox     = document.querySelector(`#tag${i}`);

            let jsonBody        = {};

            try {
                if (tagCheckbox.checked){
                    jsonBody = {
                        "properties":{
                            "interfaceType": interfaceType,
                            "interfaceNumber": interfaceNumber,
                            "tags": true
                        }
                    }    
                } else {
                    jsonBody = {
                        "properties":{
                            "interfaceType": interfaceType,
                            "interfaceNumber": interfaceNumber,
                            "tags": false
                        }
                    }                       
                }
                requestBody.push(jsonBody);
                
            } catch(e) {
                alert(e);
            }
        }

        console.log(requestBody);
        createInterfaces(deviceName, requestBody);
        clearInterfaceInput();
    });

    async function createInterfaces (deviceName, requestBody) {
        try {
            const response = await fetch(switchesDeviceNameInterfacesApiUrl + '/' + deviceName + '/interfaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                alert('Success to post switch via API.');
                return await response.json();
            } else {
                alert('Fail to post switch via API')
            }

        } catch (e) {
            alert(e);
        }
    }

    console.log(interfacesListHtml);
    
    // Interface List のプルダウンとして delete を選択されたら発火
    interfacesListHtml.addEventListener('change', async function (event){
        if (event.target.classList.contains('form-select')){
            const select = event.target;
            const action = select.value;

            const interfaceNumber = select.dataset.interfaceNumber;
            const interfaceType   = select.dataset.interfaceType;
            const tenantName      = select.dataset.tenantName;
            console.log(interfaceNumber);
            console.log(interfaceType);
            console.log(tenantName);
            //console.log(event);
            if (action == 'delete') {
                alert('ほげ');
                showDeletePopup(interfaceNumber);
            }

        }
    });

    // プルダウンとして delete を選択したら popup を表示
    function showDeletePopup(interfaceNumber) {
        const popup = document.createElement('div');
        //const popup = document.getElementById('popupContainer')
        popup.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';
        popup.innerHTML = `
          <div class="bg-white p-5 rounded-lg shadow-xl">
              <h2 class="text-xl mb-4">Delete Switch</h2>
              <p>Are you sure you want to delete ${interfaceNumber} of ${deviceName}?</p>
              <button id="cancelDelete" class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2">Cancel</button>
              <button id="confirmDelete" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
          </div>
      `;

        popup.style.zIndex = '9999';  // Ensure it's a high value

        document.body.appendChild(popup);
        currentPopup = popup;

        document.getElementById('confirmDelete').addEventListener('click', async () => {
            //await deleteSwitch(interfaceNumber);
            popup.remove();
            currentPopup = null;
        });
        document.getElementById('cancelDelete').addEventListener('click', () => {
            popup.remove();
            currentPopup = null;
        });
    }

});