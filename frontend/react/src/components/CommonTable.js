import React, { useState, useEffect } from "react";
import { ApiConfig } from "../config/Config";
import { restApiDataFetcher } from "./RestApiDataFetcher";
import Pagination from "./Pagination";
import Toast from "./Toast";
import { useNavigate } from 'react-router-dom';

const CommonTable = (props) => {

    const [data, setData] = useState([]);
    const [propertyKeys, setPropertyKeys] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    /* 
    チェックボックスで選択されたデバイス名と削除フラグとメッセージの保持
    */
    const [selectedDevices, setSelectedDevices] = useState(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    /*
    create ボタンが押されたときに /additem へ遷移
    */
    const navigate = useNavigate();

    const handleAddClick = () => {
        window.open(`/additem?type=${props.type}`, '_blank');
    };

    /*
    */

    const apiUrl = ApiConfig.apiUrlDevices + props.type;

    useEffect(() => {
        const fetchData = async () => {
            const apiFetcher = new restApiDataFetcher(apiUrl);
            let apiData = [];

            try {
                const response = await apiFetcher.getData();
                if (response.ok) {
                    apiData = await response.json();
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            }

            let keys = [];
            apiData.forEach(element => {
                // push deviceName key
                keys.push(Object.keys(element)[0]);
                // push properties key
                if (!element.properties) {
                    element.properties.forEach(propertyElement => {
                        keys.push(Object.keys(propertyElement));
                    })
                } else {
                    //                    
                }
            });

            setPropertyKeys(Array.from(new Set(keys)));
            setData(apiData);

        };
        fetchData();
    }, []);

    // 
    const handleCheckboxChange = (deviceName) => {
        setSelectedDevices(prev => {
            const updatedSelection = new Set(prev);
            if (updatedSelection.has(deviceName)) {
                updatedSelection.delete(deviceName);
            } else {
                updatedSelection.add(deviceName);
            }
            return updatedSelection;
        });
    };

    /*
    delete button がクリックされた時に以下の function が発火
    */
    const deleteData = async () => {
        const deviceNameToDelete = Array.from(selectedDevices);

        if (deviceNameToDelete.length === 0) {
            alert("no devices selected for deletion.");
            return;
        }

        setIsDeleting(true);

        deviceNameToDelete.map(async (item) => {
            const apiFetcher = new restApiDataFetcher(apiUrl + '/' + item);
            try {
                const response = await apiFetcher.deleteData();
                if (response.ok) {
                    const apiData = await response.json();
                    setData(prevData => prevData.filter(device => device.deviceName !== item));
                    setSelectedDevices(new Set());
                    setDeleteSuccess(true);
                    setTimeout(() => setDeleteSuccess(false), 3000);
                } else {
                    console.error('Failed to delete data');
                }
            } catch (error) {
                console.error('Failed to delete data', error);
            }
        })
        setIsDeleting(false);
    }

    console.log(selectedDevices);

    // pagnation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFiestItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFiestItem, indexOfLastItem);
    const hasMoreData = indexOfLastItem < data.length;

    return (
        <div className="flex flex-col px-8 shadow bg-white rounded-md border-1 border-gray-400">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-gray-600 py-2 text-lg">{props.type} list </h2>
                <div className="flex">
                    <div className="px-1">
                        <button
                            onClick={handleAddClick} 
                            className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            create
                        </button>
                    </div>
                    <div className="pl-1">
                        <button
                            onClick={deleteData}
                            disabled={isDeleting}
                            className="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                            delete
                        </button>
                    </div>
                </div>
            </div>

            {deleteSuccess && <Toast message="Deletion successful!" />}

            <div>
                <table className="w-full divide-gray-200">
                    <thead className="bg-gray-50 text-sm text-gray-600 text-center">
                        <tr>
                            <th className="text-center">
                                
                            </th>
                            {propertyKeys.map((key) => (
                                <th key={key} className="text-center">
                                    {key}
                                </th>
                            ))}
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.map((device, index) => (
                            <tr key={index}>
                                <td className="text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedDevices.has(device.deviceName)}
                                        onChange={() => handleCheckboxChange(device.deviceName)}
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                                </td>
                                <td className="text-center text-gray-600 text-sm">
                                    {device.deviceName}
                                </td>
                                {propertyKeys.map((key) => (
                                    device.properties[key] ? (
                                        <td className="text-center">
                                            {device.properties[key]}
                                        </td>
                                    ) : null
                                ))}
                                <td className="text-center text-sm">
                                    <a href={`/component?deviceName=${device.deviceName}&deviceType=${props.type}`} className="text-blue-500 hover:underline">
                                        Edit
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} onPageChange={setCurrentPage} hasMoreData={hasMoreData} data={data} itemsPerPage={itemsPerPage} />
        </div>
    );
};

export default CommonTable;