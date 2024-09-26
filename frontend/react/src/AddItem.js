import React from 'react';
import TitleHeader from './components/TitleHeader';
import CreateForm from './components/CreateForm';
import { useLocation } from 'react-router-dom';

const AddItem = () => {

    //クエリパラメータの解析
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');

    return (
        <div className="flex flex-col px-4">
            <div>
                <TitleHeader title={type} />
            </div>
            <div>
                <main className="w-full rounded-md border-1 border-gray-400 bg-white bg-slate-200 px-6">
                    <CreateForm deviceType={type} />
                </main>
            </div>
        </div>
    );
};

export default AddItem;