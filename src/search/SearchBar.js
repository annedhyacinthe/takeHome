import NameSearch from './NameSearch';
import PrefilledSearch from './PrefilledSearch';

function SearchBar() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '39%' }}>
        <NameSearch />
      </div>
      <div style={{ width: '19%' }}>
        <PrefilledSearch variantType="success" dropdownType="positions" dropdownOptions={['PF', 'PG', 'SF', 'SG', 'C']} />
      </div>
      <div style={{ width: '19%' }}>
        <PrefilledSearch variantType="success" dropdownType="statType" dropdownOptions={['Assists', 'Points', 'Rebounds', 'Steals']} />
      </div>
      <div style={{ width: '19%' }}>
        <PrefilledSearch variantType="success" dropdownType="status" dropdownOptions={['Suspended', 'Not Suspended']} />
      </div>
    </div>
  );
}

export default SearchBar;
