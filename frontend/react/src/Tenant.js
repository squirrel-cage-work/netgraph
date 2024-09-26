import React from 'react';
import TitleHeader from './components/TitleHeader';
//import CreateForm from './components/CreateForm';
import CommonTable from './components/CommonTable';
import CardGrid from './components/CardGrid';

function Tenant() {
  return (
    <div className="flex">
      <main className="w-full bg-slate-200 px-6">
        <div>
          <TitleHeader title="Tenant" />
        </div>
        <div className="w-full bg-white rounded-md border-1 border-gray-400 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1">
          <CardGrid type="tenants"/>
        </div>
        <div className='py-6'>
          <CommonTable type="tenants" />
        </div>
      </main>
    </div>
  );
}

export default Tenant;
