document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("tenantForm");
    const tenantList = document.getElementById("tenants");
    const searchInput = document.getElementById("searchTenant");
    let currentPopup = null;

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const tenantId = document.getElementById("tenantId").value;
        const tenantName = document.getElementById("tenantName").value;

        if (tenantId && tenantName) {
            await createTenant(tenantId, tenantName);
            addTenantToList(tenantId, tenantName);
            form.reset();
        }
    });

    tenantList.addEventListener("change", async function(event) {
        if (event.target.classList.contains('form-select')) {
            const select = event.target;
            const action = select.value;
            const tenantId = select.dataset.tenantId;
            const tenantName = select.dataset.tenantName;

            if (currentPopup) {
                currentPopup.remove();
                currentPopup = null;
            }

            if (action === 'update') {
                showUpdatePopup(tenantId, tenantName);
            } else if (action === 'delete') {
                showDeletePopup(tenantId);
            }

            select.selectedIndex = 0;
        }
    });

    searchInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        const rows = tenantList.querySelectorAll('tr');
    
        rows.forEach(row => {
            const tenantIdCell = row.querySelector('td:first-child');
            const tenantNameCell = row.querySelector('td:nth-child(2)');
            
            if (tenantIdCell && tenantNameCell) {
                const tenantId = tenantIdCell.textContent.toLowerCase();
                const tenantName = tenantNameCell.textContent.toLowerCase();
                const isVisible = tenantId.includes(searchTerm) || tenantName.includes(searchTerm);
                row.style.display = isVisible ? '' : 'none';
            }
        });
    });
    
    function showUpdatePopup(tenantId, tenantName) {
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';
        popup.innerHTML = `
            <div class="bg-white p-5 rounded-lg shadow-xl">
                <h2 class="text-xl mb-4">Update Tenant</h2>
                <p class="mb-2">Tenant ID: ${tenantId}</p>
                <input type="text" id="newTenantName" value="${tenantName}" class="border p-2 mb-4 w-full">
                <div class="flex justify-end">
                    <button id="cancelUpdate" class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2">Cancel</button>
                    <button id="confirmUpdate" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update</button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
        currentPopup = popup;

        document.getElementById('cancelUpdate').addEventListener('click', () => popup.remove());
        document.getElementById('confirmUpdate').addEventListener('click', async () => {
            const newName = document.getElementById('newTenantName').value;
            if (newName) {
                await updateTenant(tenantId, newName);
                updateTenantInList(tenantId, newName);
                popup.remove();
            }
        });
    }

    function showDeletePopup(tenantId) {
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';
        popup.innerHTML = `
            <div class="bg-white p-5 rounded-lg shadow-xl">
                <h2 class="text-xl mb-4">Delete Tenant</h2>
                <p class="mb-4">Are you sure you want to delete tenant ID ${tenantId}?</p>
                <div class="flex justify-end">
                    <button id="cancelDelete" class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2">Cancel</button>
                    <button id="confirmDelete" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
        currentPopup = popup;

        document.getElementById('cancelDelete').addEventListener('click', () => popup.remove());
        document.getElementById('confirmDelete').addEventListener('click', async () => {
            await deleteTenant(tenantId);
            document.querySelector(`tr[data-tenant-id="${tenantId}"]`).remove();
            popup.remove();
        });
    }

    async function createTenant(tenantId, tenantName) {
        try {
            const response = await fetch('/api/create-tenant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId, tenantName }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create tenant. Please try again.');
        }
    }

    async function updateTenant(tenantId, tenantName) {
        try {
            const response = await fetch('/api/update-tenant', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId, tenantName }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update tenant. Please try again.');
        }
    }

    async function deleteTenant(tenantId) {
        try {
            const response = await fetch(`/api/delete-tenant/${tenantId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Network response was not ok');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete tenant. Please try again.');
        }
    }

    function addTenantToList(tenantId, tenantName) {
        const row = document.createElement('tr');
        row.dataset.tenantId = tenantId;
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${tenantId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tenantName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <select class="form-select" data-tenant-id="${tenantId}" data-tenant-name="${tenantName}">
                    <option value="">Select action</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                </select>
            </td>
        `;
        tenantList.appendChild(row);
    }

    function updateTenantInList(tenantId, tenantName) {
        const row = document.querySelector(`tr[data-tenant-id="${tenantId}"]`);
        if (row) {
            row.querySelector('td:nth-child(2)').textContent = tenantName;
            row.querySelector('select').dataset.tenantName = tenantName;
        }
    }

    async function loadTenants() {
        try {
            const response = await fetch('/api/get-tenants');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tenants = await response.json();
            if (tenants.length === 0) {
                tenantList.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center">No tenants found</td></tr>';
            } else {
                tenantList.innerHTML = ''; // Clear existing rows
                tenants.forEach(tenant => addTenantToList(tenant.tenantId, tenant.tenantName));
            }
        } catch (error) {
            console.error('Error loading tenants:', error);
            tenantList.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Failed to load tenants: ${error.message}</td></tr>`;
        }
    }

    loadTenants();
});
