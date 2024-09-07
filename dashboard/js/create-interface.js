document.addEventListener("DOMContentLoaded", function () {
    
    // fetch query parameter
    const queryString = window.location.search;
    const params      = new URLSearchParams(queryString);

    const deviceName  = params.get('deviceName');

    // Replace h1
    let h1Element = document.getElementById('h1-container');
    h1Element.innerHTML = `<h1 class="text-2xl font-bold mb-4">Create Interfaces for ${deviceName}</h1>`

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

    document.getElementById('createInterfaceForm').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const formData = new FormData(event.target);

        for (let i = 1; i <= interfaceIndex; i++){
            const interfaceType   = formData.get(`interfaceType${i}`);
            const interfaceNumber = formData.get(`interfaceNumber${i}`);
            const tagId           = formData.get(`tag${i}`);

            console.log(interfaceType)
            console.log(interfaceNumber)
            console.log(tagId)


        }

    });
});