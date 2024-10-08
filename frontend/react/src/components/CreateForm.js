import React, { useState } from 'react';
import { ItemDefinition } from '../config/ItemDefinition';
import { restApiDataFetcher } from './RestApiDataFetcher';
import { ApiConfig } from '../config/Config';

//const type = ItemDefinition.tenantItemDefinition;

const CreateForm = (props) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMesage] = useState('');

    let type = [];
    let apiUrl = '';

    /*
    グラフデータベースに登録したい種別が増えた場合はこちらを修正する API の定義とテーブル定義は以下の jsx にある。
        config/Config.js
        config/ItemDefinitions.js
    */
    if (props.deviceType === 'tenants') {
        type = ItemDefinition.tenantItemDefinition;
        apiUrl = ApiConfig.apiUrlTenantsTenantName;
    } else if (props.deviceType === 'switches') {
        type = ItemDefinition.switchItemDefinition;
        apiUrl = ApiConfig.apiUrlSwitchesDeviceName;
    } else if (props.deviceType === 'routers') {
        type = ItemDefinition.routerItemDefinition;
        apiUrl = ApiConfig.apiUrlRoutersDeviceName;
    } else if (props.deviceType === 'vlans') {
        type = ItemDefinition.    vlanItemDefinition;
    }

    const handleInputChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setSuccessMesage('');

        let deviceName = '';

        /*
        グラフデータベースに登録したい種別が増えた場合はこちらを修正する
        */
        if (props.deviceType === 'tenants') {
            deviceName = formData['tenantName'];
            console.log(deviceName);
        } else if (props.deviceType === 'switches' || props.deviceType === 'routers') {
            deviceName = formData['deviceName'];
            console.log(deviceName);
        }

        const apiFetcher = new restApiDataFetcher(apiUrl + deviceName);

        try {
            const response = await apiFetcher.postData();
            console.log(response);
            if (response.ok) {
                setSuccessMesage('Form submitted successfully!');
                setFormData({});
            } else {
                console.error('Failed to post data');
            }
        } catch (error) {
            console.error('Failed to post data', error);
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <h2 className='text-lg font-bold mb-4 text-gray-600'>create new {props.title}</h2>
            <form onSubmit={handleSubmit}>
                {type.map((item, index) => {
                    const keyArray = Object.keys(item);
                    return keyArray.map((key) => (
                        <div key={index} class="px-4">
                            <label className='block mb-2 font-bold font-bold text-gray-600'>{item[key]}</label>
                            <input 
                                type="text" 
                                value={formData[key] || ''}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md px-2 focus:ring-blue-500 focus:border-blue-500 block w-full py-1' />
                        </div>
                    ));
                }
                )}
                <div className='px-4 py-6'>
                    <button type="submit" className='px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                        {loading ? 'Submitting...' : 'Create'}
                    </button>
                </div>
            </form>

            {successMessage && (
                <div className='px-4 text-red-600 mt-2'>
                    {successMessage}
                </div>
            )}
        </>
    );
};

export default CreateForm;