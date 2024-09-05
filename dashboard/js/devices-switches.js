document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("switchForm");
    const switchesBody = document.getElementById("switches");
    const searchInput = document.getElementById("searchSwitch");
    const totalSwitches = document.getElementById("totalSwitches");
    let currentPopup = null;
    let switches = []; // ローカルでスイッチデータを保持

    // load devicesSwitchesApiUrl from config.js
    const devicesSwitchesApiUrl = config.devicesSwitchesApiUrl;
    const devicesApiUrl         = config.devicesApiUrl;

    console.log(devicesApiUrl);

    // 初期データの読み込み
    loadInitialData();

    async function loadInitialData() {
        try {
            const response = await fetch(devicesApiUrl + '/' + 'switches', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
        const apiResponse = await response.json();

        // データ変換関数
        function transformData(data) {
            let result = [];

            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let tenantName = '';
        
                if (item.properties.tenant) {
                    tenantName = item.properties.tenant
                }
        
                result.push({
                    name: item.deviceName,
                    tenantName: tenantName
                });
            }
            return result;
        }
        
        // データを変換
        const transformedData = transformData(apiResponse);

        switches = transformedData

        } catch (error) {
            console.log(response);
            console.error('Failed to load initial data from API:', error);
            // APIが利用できない場合、サンプルデータを使用
            switches = [
                { name: "Error!!", tenantName: "Error!!" }
            ];
        }
        switches.forEach(switchData => addSwitchToList(switchData));
    }


    // Add listeners to form submission events 
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const switchName = document.getElementById("switchName").value;
        if (switchName) {
            await createSwitch(switchName);
            form.reset();
        }
    });

    async function createSwitch(switchName) {
        try {
            const response = await fetch(devicesSwitchesApiUrl + '/' + switchName, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(devicesSwitchesApiUrl + '/' + switchName)
   
            const newSwitch = { name: switchName, tenantName: "" };
            switches.push(newSwitch);
            addSwitchToList(newSwitch);
        } catch (error) {
            console.error('Failed to create switch via API:', error);
        }
    }



    switchesBody.addEventListener("change", async function (event) {
        if (event.target.classList.contains('form-select')) {
            const select = event.target;
            const action = select.value;
            const switchName = select.dataset.switchName;
            const tenantName = select.dataset.tenantName;

            if (currentPopup) {
                currentPopup.remove();
                currentPopup = null;
            }

            if (action === 'delete'){
                showDeletePopup(switchName);
            }

            /*
            if (action === 'update') {
                showUpdatePopup(switchName, tenantName);
            } else if (action === 'delete') {
                showDeletePopup(switchName);
            }
            */

            select.selectedIndex = 0;
        }
    });

    function showDeletePopup(switchName) {

        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';
        popup.innerHTML = `
          <div class="bg-white p-5 rounded-lg shadow-xl">
              <h2 class="text-xl mb-4">Delete Switch</h2>
              <p>Are you sure you want to delete switch ${switchName}?</p>
              <button id="cancelDelete" class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2">Cancel</button>
              <button id="confirmDelete" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
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

    async function deleteSwitch(switchName) {
        try {
            await fetch(devicesSwitchesApiUrl + '/' + switchName, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        console.log(devicesSwitchesApiUrl + '/' + switchName)
        } catch (error) {
            console.error('Failed to delete switch via API:', error);
            alert('Failed to delete switch via API:');
        }
        clearSwitchTable();
        loadInitialData();
    }

    function clearSwitchTable() {
        const switchesBody = document.getElementById('switches'); // tbodyのIDに合わせて修正
        switchesBody.innerHTML = ''; // テーブルの内容をクリア
    }
    
    function addSwitchToList(switchData) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${switchData.name}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${switchData.tenantName || ''}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <select class="form-select text-gray-600" data-switch-name="${switchData.name}" data-tenant-name="${switchData.tenantName || ''}">
                  <option value="">Select Action</option>
                  <option value="delete">Delete</option>
              </select>
          </td>
      `;
        switchesBody.appendChild(row);
    }
    function searchSwitches() {
        // 検索フィールドの値を取得
        const input = document.getElementById("searchSwitch").value.toLowerCase();
        const table = document.getElementById("switches");
        const rows = table.getElementsByTagName("tr");
    
        // 各行のすべてのセルをチェックして、フィルタリング
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName("td");
            let rowContainsSearchText = false;
    
            // 各セルを調べる
            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                if (cell) {
                    const cellText = cell.textContent || cell.innerText;
                    if (cellText.toLowerCase().indexOf(input) > -1) {
                        rowContainsSearchText = true;
                        break; // 一致するものがあればその行を表示
                    }
                }
            }
    
            // 検索結果がある行だけを表示
            if (rowContainsSearchText) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
});
