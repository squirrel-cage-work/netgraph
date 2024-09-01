document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("tenantForm");
    const tenantList = document.getElementById("tenants");
    const submitActionsButton = document.getElementById("submitActionsButton");
    const searchInput = document.getElementById("searchTenant");

    let tenants = []; // テナントデータを保持する配列

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const tenantId = document.getElementById("tenantId").value;
        const tenantName = document.getElementById("tenantName").value;

        if (tenantId && tenantName) {
            await createTenant(tenantId, tenantName);
            tenants.push({ tenantId, tenantName });
            renderTenants();
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
                    tenants = tenants.filter(t => t.tenantId !== tenantId);
                    renderTenants();
                }
            }

            // Reset the select to "Select action" after processing
            select.selectedIndex = 0;
        }
    });

    // 改善された検索機能
    searchInput.addEventListener("input", function() {
        renderTenants();
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
        return row;
    }

    function updateTenantInList(tenantId, tenantName) {
        const index = tenants.findIndex(t => t.tenantId === tenantId);
        if (index !== -1) {
            tenants[index].tenantName = tenantName;
            renderTenants();
        }
    }

    async function loadTenants() {
        try {
            const response = await fetch('/api/get-tenants');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            tenants = await response.json();
            renderTenants();
        } catch (error) {
            console.error('Error loading tenants:', error);
            tenantList.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Failed to load tenants: ${error.message}</td></tr>`;
        }
    }

    // 新しい関数: テナントの並べ替えとレンダリング
    function renderTenants() {
        const searchTerm = searchInput.value.toLowerCase();
        
        // テナントを検索語に基づいて並べ替え
        const sortedTenants = tenants.sort((a, b) => {
            const aMatch = (a.tenantId.toLowerCase().includes(searchTerm) || a.tenantName.toLowerCase().includes(searchTerm)) ? 1 : 0;
            const bMatch = (b.tenantId.toLowerCase().includes(searchTerm) || b.tenantName.toLowerCase().includes(searchTerm)) ? 1 : 0;
            return bMatch - aMatch; // マッチしたものを上に
        });

        tenantList.innerHTML = ''; // リストをクリア

        sortedTenants.forEach(tenant => {
            const row = addTenantToList(tenant.tenantId, tenant.tenantName);
            const isVisible = tenant.tenantId.toLowerCase().includes(searchTerm) || tenant.tenantName.toLowerCase().includes(searchTerm);
            row.style.display = isVisible ? '' : 'none';
            tenantList.appendChild(row);
        });

        if (tenantList.children.length === 0) {
            tenantList.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center">No matching tenants found</td></tr>';
        }
    }

    loadTenants();
});
