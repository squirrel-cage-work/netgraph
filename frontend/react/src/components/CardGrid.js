import React, { useEffect, useState } from 'react';
import { restApiDataFetcher } from './RestApiDataFetcher';
import { ApiConfig } from '../config/Config';

type typeProps = {
    type: string;
};

const CardGrid: React.FC<typeProps> = (props) => {

    const [data, setData] = useState(null);
    const apiUrl = ApiConfig.apiUrlDevices + props.type;

    useEffect(() => {
        const fetchData = async () => {
            const apiFetcher = new restApiDataFetcher(apiUrl);
            try {
                const response = await apiFetcher.getData();
                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to fetch data', error)
            }
        };
        fetchData();
    }, [apiUrl]);

    return (
        <div className="flex py-4 px-4">
            <div>
                <i className="fas fa-users fa-2x text-gray-400"></i>
            </div>
            <div className='px-4'>
                <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                        the total number of {props.type}
                    </dt>
                    <dt className='text-lg font-medium text-gray-900'>
                        {data ? data.length : 'Loading...'}
                    </dt>
                </dl>
            </div>
        </div>
    );
};

export default CardGrid;