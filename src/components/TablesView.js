import React from 'react';
import Tables from "./Tables";

import './TablesView.css';
import Navigation from "./Navigation";
const TablesView = () => {

  return (
    <>
      <Navigation/>
      <div className="table-wrapper">
        <div>
          <h1>Pub Tables</h1>
          <Tables/>
        </div>
      </div>
    </>
  );
}

export default TablesView;