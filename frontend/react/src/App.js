import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Menu from './components/Menu';
import Tenant from './Tenant';
import Switch from './Switch';
import Vlan from './Vlan';
import DeviceRouter from './DeviceRouter';
import AddItem from './AddItem';
import Component from './Component';

function App() {
  return (
    <>
    <Router>
      <div className="flex">
        <Menu />
        <main className="w-full bg-slate-200">
            <Routes>
              <Route path="/tenant" element={<Tenant />} />
              <Route path="/switch" element={<Switch />} />
              <Route path="/router" element={<DeviceRouter />} />
              <Route path="/vlan" element={<Vlan />} />
              {/* 他のルートもここに追加する */}
              <Route path="/additem" element={<AddItem />} />
              <Route path="/component" element={<Component />} />
            </Routes>
        </main>
      </div>
    </Router>
    </>
  );
}

export default App;
