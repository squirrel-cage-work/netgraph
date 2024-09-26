import React, { useState } from 'react';

const interfaceTableDefinition = [
  'interface type',
  'interface number',
  //'tag',
  //'Action'
];

const interfaceTableDefinitionObject = [{
  'interface type': '',
  'interface number': ''
}];

const Interface = () => {

  // テーブルの列データの管理
  const [tableCols, setTableCols] = useState(interfaceTableDefinition);
  // テーブルの行データの管理
  const [tableRows, setTableRows] = useState([]);

  // テーブルの行データの追加
  const addTableRows = () => {
    setTableRows((prevRows) => [...prevRows, {}]);
  };


  const handleInputChange = (rowIndex, col, value) => {
    setTableRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex] = { ...newRows[rowIndex], [col]: value };
      console.log(newRows);
      return newRows;
    });
  };

  //テーブルの行データの削除
  const removeTableRows = (index) => {
    setTableRows((prevRows) => {
      const newRows = prevRows.filter((_, i) => i !== index);
      return newRows; // ここで新しい配列を返します
    });
  };

  return (
    <div className='rounded-md border-1 bg-white px-4 py-2'>
      <table className="w-full text-sm text-justify">
        <thead className='text-xs text-gray-700 uppercase'>
          <tr>
            {interfaceTableDefinition.map((item, index) => {
              return (
                <th scope='col' className='px-2 py-1' key={index}>{item}</th>
              )
            })}
            <th scope='col' className='px-2 py-1'>tag</th>
            <th scope='col' className='px-2 py-1'>action</th>
          </tr>
        </thead>

        <tbody>
          {tableRows.map((row, rowIndex) => {
            return (
              <tr key={rowIndex} className='bg-white hover:bg-gray-100'>
                {tableCols.map((col, colIndex) => {
                  return (
                    <td key={colIndex} className='text-white px-2 py-1'>
                      <input
                        value={row[col]} // 現在の値を表示
                        onChange={(e) => handleInputChange(rowIndex, col, e.target.value)}
                        className='px-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-blue-500 focus:border-blue-500 block py-1' required/>
                    </td>
                  )
                })}
                <td className='text-white px-2 py-1'>
                  <input type="checkbox" />
                </td>
                <td>
                  <button 
                    className='px-2 py-1 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
                    onClick={(e) => removeTableRows(rowIndex)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
        <button
          type="button"
          className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={addTableRows}>
          + interface
        </button>
      </table>
    </div>
  );
};

export default Interface;
