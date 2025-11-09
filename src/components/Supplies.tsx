import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import SupplyItem from "./SupplyItem";
import { Loader } from "./Loader";
import { ToastContainer } from "react-toastify";
import {API, authFetch} from "../api/auth";

export type Supply = {
  ingredient_id: number,
  ingredient_name: string,
  stock_quantity: number,
}
type SuppliesResponse = { inventory?: Supply[] };

const Supplies = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suppliesData, setSuppliesData] = useState<SuppliesResponse>({});
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    authFetch(`${API}/report/inventory`)
      .then((r) => r.json())
      .then((r: SuppliesResponse) => setSuppliesData(r))
      .finally(() => setIsLoading(false));
  }, [reload]);

  const recheck = async () => {
    setIsLoading(true);
    authFetch(`${API}/report/recheck`)
      .then(response => response.json())
      .then(r => {
        setIsLoading(false);
        console.log(r);
      });
    }

  return (
    <>
      <Navigation />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="menu-wrapper">
          <div>
            <button type="button" className="table-button show-order-button" onClick={() => {
              recheck()
            }
            }>Check supplies</button>
          </div>
          {suppliesData.inventory?.map((item) => (
            <SupplyItem key={item.ingredient_id} item={item} setReload={setReload} />
          ))}
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Supplies;
