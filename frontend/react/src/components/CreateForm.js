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

    console.log('hoge');
    console.log(props.deviceType);

    /*
    グラフデータベースに登録したい種別が増えた場合はこちらを修正
    */
    if (props.deviceType === 'tenants') {
        type = ItemDefinition.tenantItemDefinition;
        apiUrl = ApiConfig.apiUrlTenantsTenantName;
    } else if (props.deviceType === 'switches') {
        type = ItemDefinition.switchItemDefinition;
        apiUrl = ApiConfig.apiUrlSwitchesDeviceName;
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

        if (props.deviceType === 'tenants') {
            deviceName = formData['tenantName'];
            console.log(deviceName);
        } else if (props.deviceType === 'switches') {
            deviceName = formData['deviceName'];
            console.log(deviceName);
        }

        const apiFetcher = new restApiDataFetcher(apiUrl + deviceName);

        try {
            const response = await apiFetcher.postData();
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
                    <button type="submit" className='px-2 py-1.5 py-1inline-flex justify-center border border-transparent shadow-sm text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
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