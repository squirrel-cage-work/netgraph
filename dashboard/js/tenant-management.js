document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("tenantForm");
    const tenantList = document.getElementById("tenants");
    const submitActionsButton = document.getElementById("submitActionsButton");

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

    submitActionsButton.addEventListener("click", async function() {
        const selects = document.querySelectorAll('select.form-select');
        for (const select of selects) {
            const action = select.value;
            const tenantId = select.dataset.tenantId;
            const tenantName = select.dataset.tenantName;

            if (action === 'update') {
                const newName = prompt('Enter new name for tenant ID ' + tenantId, tenantName);
                if (newName) {
                    await updateTenant(tenantId, newName);
                    updateTenantInList(tenantId, newName);
                }
            } else if (action === 'delete') {
                if (confirm('Are you sure you want to delete tenant ID ' + tenantId + '?')) {
                    await deleteTenant(tenantId);
                    document.querySelector(`tr[data-tenant-id="${tenantId}"]`).remove();
                }
            }

            // Reset the select to "Select action" after processing
            select.selectedIndex = 0;
        }
    });

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
        }
    }

    async function loadTenants() {
        try {
            const response = await fetch('/api/get-tenants');
            const tenants = await response.json();
            tenants.forEach(tenant => addTenantToList(tenant.tenantId, tenant.tenantName));
        } catch (error) {
            console.error('Error loading tenants:', error);
        }
    }
    loadTenants();
});
