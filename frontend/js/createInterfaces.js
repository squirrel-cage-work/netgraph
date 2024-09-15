const interfacesContainer = document.getElementById('interfacesContainer');
const addInterfaces = document.getElementById('addInterfaces');
let interfaceIndex = 0;

function addInterfaceTable() {
    interfaceIndex++;

    const tableBodyRow = document.createElement('tr');
    tableBodyRow.class = 'bg-gray-50';
    tableBodyRow.innerHTML = `
        <td class="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
            <input type="text" id="interfaceType${interfaceIndex}" name="interfaceType${interfaceIndex}" class="w-full px-1 py-0.5 placeholder-gray-400 text-gray-700 bg-white rounded border border-gray-300 text-sm shadow focus:outline-none focus:ring focus:border-blue-300" required>
        </td>
        <td class="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
            <input type="text" id="interfaceNumber${interfaceIndex}" name="interfaceNumber${interfaceIndex}" class="w-full px-1 py-0.5 placeholder-gray-400 text-gray-700 bg-white rounded border border-gray-300 text-sm shadow focus:outline-none focus:ring focus:border-blue-300" required>
        </td>
        <td class="px-4 py-1 whitespace-nowrap text-center">
            <input type="checkbox" id="tag${interfaceIndex}" name="tag${interfaceIndex}" class="mt-1">
        </td>
        <td class="px-4 py-1 text-right">
            <button type="button" class="text-gray-500 hover:text-gray-900 delete-button" onclick="removeInterface(this)">delete</button>
        </td>
    `;
    interfacesContainer.appendChild(tableBodyRow);

}

// EventListener

addInterfaces.addEventListener('click', function () {
    addInterfaceTable();
});

window.removeInterface = function(button) {
    button.closest('tr').remove();
}