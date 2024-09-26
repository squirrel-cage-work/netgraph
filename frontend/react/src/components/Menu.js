import React from 'react';

const menuItems = [
  { name: 'Dashboard', link: 'main.html', icon: 'fas fa-home' },
  { name: 'Tenant', link: '/tenant', icon: 'fas fa-home' },
  {
    name: 'Devices',
    icon: 'fas fa-home',
    subMenu: [
      { name: 'Switches', link: '/switch', icon: 'fas fa-home' },
      { name: 'Routers', link: 'devicesRouters.html', icon: 'fas fa-home' },
    ],
  },
  {
    name: 'Virtuals',
    icon: 'fas fa-home',
    subMenu: [
      { name: 'Vlan Scopes', link: 'virtualsVlanscopes.html', icon: 'fas fa-home' },
      { name: 'IPs', link: '#', icon: 'fas fa-route' },
    ],
  },
  { name: 'Connections', link: '', icon: 'fas fa-home' },
];

const Menu = () => {
  return (
    <div className="flex flex-col min-h-screen w-1/4 bg-gray-800">
      <div className="h-24 flex items-center justify-center">
        <img className="h-8" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"></img>
      </div>
      <div className="mt-1">
        <nav>
          {menuItems.map((item, index) => (
            <div key={index}>
              <a
                href={item.link}
                className="text-gray-300 hover:bg-gray-700 hover:text-white flex items-center px-3 py-2 text-sm rounded-md"
              >
                <i className={`${item.icon} mr-3 h-3.5 w-4`}></i>
                {item.name}
              </a>
              {item.subMenu && (
                <ul className="dropdown-menu ml-6">
                  {item.subMenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href={subItem.link}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white flex items-center px-3 py-2 text-sm rounded-md"
                      >
                        <i className={`${subItem.icon} mr-3 h-3.5 w-4`}></i>
                        {subItem.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Menu;
