// import './nameSearch.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FilterContext } from '../FilterContext'
import React, { useContext, useState } from 'react';

function NameSearch() {
    const [name, setName] = useState('');
    // console.log(useContext(FilterContext))
  return (
    <div >
      <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Player or Team Name"
                    className="me-2"
                    aria-label="Search"
                    value = {name}
                    onChange = {(e) => setName(e.target.value)}
                    style = {{boxShadow: 'none'}}
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
    </div>
  );
}

export default NameSearch;