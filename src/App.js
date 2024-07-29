import './App.css';
import SearchBar from './search/SearchBar'
import Table from './table/Table'
import React from 'react';
import { FilterProvider } from './FilterContext'
function App() {
  return (
    <FilterProvider>
        <div className="Table-style" style = {{margin: 'auto',marginTop:'30px'}}>
          <SearchBar/>
          <Table />
        </div>
    </FilterProvider>

  );
}

export default App;
