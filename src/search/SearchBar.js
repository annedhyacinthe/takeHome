// import './SearchBar.css';
import NameSearch from './NameSearch.js'
import PrefilledSearch from './PrefilledSearch.js'

function SearchBar() {
  return (
    <div style = {{display: 'flex', justifyContent: 'space-between'}}>
      <div style = {{width: '39%'}}>
        <NameSearch />
      </div>
      <div style = {{width: '19%'}}>
        <PrefilledSearch variantType = "success" dropdownType = "Position" dropdownOptions = {['PF','PG','SF','SG','C']} />
      </div>
      <div style = {{width: '19%'}}>
        <PrefilledSearch variantType = "success" dropdownType = "Stat Type" dropdownOptions = {['Assists','Points','Rebounds','Steals']} />
      </div>
      <div style = {{width: '19%'}}>
        <PrefilledSearch variantType = "success" dropdownType = "Market Status" dropdownOptions = {['Suspended','Not Suspended']} />
      </div>
    </div>
  );
}

export default SearchBar;