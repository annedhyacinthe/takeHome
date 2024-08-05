import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, {
  useContext, useState,
} from 'react';
import { FilterContext } from '../FilterContext';

function PrefilledSearch(props) {
  const {
    setPositions, setStatus, setStatType,
  } = useContext(FilterContext);
  const [selection, setSelection] = useState({});

  function setFilter() {
    switch (props.dropdownType) {
      case 'statType':
        setStatType({ ...selection });
        break;
      case 'positions':
        setPositions({ ...selection });
        break;
      case 'status':
        setStatus({ ...selection });
        break;
    }
  }

  return (
    <Dropdown style={{ display: 'grid' }} autoClose="outside" id={props.dropdownType}>
      <Dropdown.Toggle id="dropToggle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color:'black', backgroundColor: 'orange', borderWidth: '0'}}>
        {props.dropdownType}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: '100%', paddingBottom: '1px' }} id="dropMenu">
        {props.dropdownOptions.map((option) => (
          <Dropdown.Item>
            <Form.Check
              inline
              label={option}
              id={option}
              onClick={() => {
                if (!selection[option]) {
                  selection[option] = true;
                  setSelection(selection);
                } else {
                  delete selection[option];
                  setSelection(selection);
                }
              }}
            />
          </Dropdown.Item>
        ))}
        <Button style={{ width: '100%', backgroundColor:'firebrick', borderWidth: '0' }} onClick={() => setFilter()}>Apply</Button>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default PrefilledSearch;
