document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("switchForm");
  const switchesBody = document.getElementById("switches");
  const searchInput = document.getElementById("searchSwitch");
  const totalSwitches = document.getElementById("totalSwitches");
  let currentPopup = null;
  let switches = []; // ローカルでスイッチデータを保持

  // 初期データの読み込み
  loadInitialData();

  form.addEventListener("submit", async function(event) {
      event.preventDefault();
      const switchName = document.getElementById("switchName").value;
      if (switchName) {
          await createSwitch(switchName);
          form.reset();
      }
  });

  switchesBody.addEventListener("change", async function(event) {
      if (event.target.classList.contains('form-select')) {
          const select = event.target;
          const action = select.value;
          const switchName = select.dataset.switchName;
          const tenantName = select.dataset.tenantName;
          
          if (currentPopup) {
              currentPopup.remove();
              currentPopup = null;
          }

          if (action === 'update') {
              showUpdatePopup(switchName, tenantName);
          } else if (action === 'delete') {
              showDeletePopup(switchName);
          }

          select.selectedIndex = 0;
      }
  });

  searchInput.addEventListener("input", function() {
      const searchTerm = this.value.toLowerCase();
      const rows = switchesBody.querySelectorAll('tr');
      rows.forEach(row => {
          const switchNameCell = row.querySelector('td:first-child');
          const tenantNameCell = row.querySelector('td:nth-child(2)');
          if (switchNameCell && tenantNameCell) {
              const switchName = switchNameCell.textContent.toLowerCase();
              const tenantName = tenantNameCell.textContent.toLowerCase();
              const isVisible = switchName.includes(searchTerm) || tenantName.includes(searchTerm);
              row.style.display = isVisible ? '' : 'none';
          }
      });
  });

  async function loadInitialData() {
      try {
          const response = await fetch('/api/switches');
          switches = await response.json();
      } catch (error) {
          console.error('Failed to load initial data from API:', error);
          // APIが利用できない場合、サンプルデータを使用
          switches = [
              { name: "Switch1", tenantName: "Tenant A" },
              { name: "Switch2", tenantName: "Tenant B" },
              { name: "Switch3", tenantName: "" }
          ];
      }
      switches.forEach(switchData => addSwitchToList(switchData));
      updateTotalSwitches();
  }

  async function createSwitch(switchName) {
      try {
          const response = await fetch('/api/switches', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: switchName }),
          });
          const newSwitch = await response.json();
          switches.push(newSwitch);
          addSwitchToList(newSwitch);
      } catch (error) {
          console.error('Failed to create switch via API:', error);
          // APIが利用できない場合、ローカルで処理
          const newSwitch = { name: switchName, tenantName: "" };
          switches.push(newSwitch);
          addSwitchToList(newSwitch);
      }
      updateTotalSwitches();
  }

  function addSwitchToList(switchData) {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${switchData.name}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${switchData.tenantName || ''}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <select class="form-select" data-switch-name="${switchData.name}" data-tenant-name="${switchData.tenantName || ''}">
                  <option value="">Select Action</option>
                  <option value="update">Update</option>
                  <option value="delete"Delete</option>
              </select>
          </td>
      `;
      switchesBody.appendChild(row);
  }

  function updateTotalSwitches() {
      totalSwitches.textContent = switches.length;
  }

  function showUpdatePopup(switchName, tenantName) {
      const popup = document.createElement('div');
      popup.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';
      popup.innerHTML = `
          <div class="bg-white p-6 rounded-lg">
              <h2 class="text-xl font-bold mb-4">Update Switch</h2>
              <p>Switch Name: ${switchName}</p>
              <input type="text" id="newTenantName" placeholder="New Tenant Name" value="${tenantName || ''}" class="border p-2 mb-4">
              <button id="updateSwitch" class="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
              <button id="cancelUpdate" class="bg-gray-300 text-black px-4 py-2 rounded ml-2">Cancel</button>
          </div>
      `;
      document.body.appendChild(popup);
      currentPopup = popup;

      document.getElementById('updateSwitch').addEventListener('click', async () => {
          const newTenantName = document.getElementById('newTenantName').value;
          await updateSwitch(switchName, newTenantName);
          popup.remove();
          currentPopup = null;
      });

      document.getElementById('cancelUpdate').addEventListener('click', () => {
          popup.remove();
          currentPopup = null;
      });
  }

  function showDeletePopup(switchName) {
      const popup = document.createElement('div');
      popup.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';
      popup.innerHTML = `
          <div class="bg-white p-6 rounded-lg">
              <h2 class="text-xl font-bold mb-4">Delete Switch</h2>
              <p>Are you sure you want to delete switch ${switchName}?</p>
              <button id="confirmDelete" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
              <button id="cancelDelete" class="bg-gray-300 text-black px-4 py-2 rounded ml-2">Cancel</button>
          </div>
      `;
      document.body.appendChild(popup);
      currentPopup = popup;

      document.getElementById('confirmDelete').addEventListener('click', async () => {
          await deleteSwitch(switchName);
          popup.remove();
          currentPopup = null;
      });

      document.getElementById('cancelDelete').addEventListener('click', () => {
          popup.remove();
          currentPopup = null;
      });
  }

  async function updateSwitch(switchName, newTenantName) {
      try {
          const response = await fetch(`/api/switches/${switchName}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ tenantName: newTenantName }),
          });
          const updatedSwitch = await response.json();
          updateSwitchInList(updatedSwitch);
      } catch (error) {
          console.error('Failed to update switch via API:', error);
          // APIが利用できない場合、ローカルで処理
          const switchToUpdate = switches.find(s => s.name === switchName);
          if (switchToUpdate) {
              switchToUpdate.tenantName = newTenantName;
              updateSwitchInList(switchToUpdate);
          }
      }
  }

  async function deleteSwitch(switchName) {
      try {
          await fetch(`/api/switches/${switchName}`, {
              method: 'DELETE',
          });
          removeSwitchFromList(switchName);
      } catch (error) {
          console.error('Failed to delete switch via API:', error);
          // APIが利用できない場合、ローカルで処理
          removeSwitchFromList(switchName);
      }
  }

  function updateSwitchInList(updatedSwitch) {
      const row = switchesBody.querySelector(`tr:has(select[data-switch-name="${updatedSwitch.name}"])`);
      if (row) {
          row.querySelector('td:nth-child(2)').textContent = updatedSwitch.tenantName || '';
          row.querySelector('select').dataset.tenantName = updatedSwitch.tenantName || '';
      }
      const index = switches.findIndex(s => s.name === updatedSwitch.name);
      if (index !== -1) {
          switches[index] = updatedSwitch;
      }
  }

  function removeSwitchFromList(switchName) {
      const row = switchesBody.querySelector(`tr:has(select[data-switch-name="${switchName}"])`);
      if (row) {
          row.remove();
      }
      switches = switches.filter(s => s.name !== switchName);
      updateTotalSwitches();
  }
});