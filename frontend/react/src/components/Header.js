import React from 'react';

type titleProps = {
    title: string;
};

const Header: React.FC<titleProps> = (props) => {

    return (
        <div class="flex justify-between items-center h-1/5">
            <div className=''>
                <header className="text-2xl font-bold py-6 px-4 w-64 text-gray-500">
                    {props.title}
                </header>
            </div>
        </div>
    );
};

export default Header;
