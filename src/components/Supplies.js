import './Menu.css';
import Navigation from "./Navigation";
import React, {useEffect, useState} from "react";
import {Loader} from "./Loader";
import SupplyItem from "./SupplyItem";

import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from "react-toastify";

const Supplies = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [suppliesData, setSuppliesData] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        // fetch('https://projekt-pub.onrender.com/report/inventory')
        fetch('https://projekt-pub.onrender.com/report/inventory')
          .then(response => response.json())
          .then(r => {
              setIsLoading(false);
              setSuppliesData(r);
          });
        if(reload) {
          toast.success("Ingredient successfully added!", {
            position: "bottom-center"
          });
          setReload(false);
        }
    }, [reload]);

    return (
      <>
          <Navigation/>
          {isLoading ? <Loader /> : <div className="menu-wrapper">
            {suppliesData.inv?.map(item => <SupplyItem key={item[0]} item={item} setReload={setReload}/>)}
          </div>}
          <ToastContainer/>
      </>

    );
}

export default Supplies;