import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import SupplyItem from "./SupplyItem";
import { Loader } from "./Loader";
import { ToastContainer } from "react-toastify";
import {API, authFetch} from "../api/auth";

type SuppliesRow = any[]; // np. [id, name, qty, unit]
type SuppliesResponse = { inv?: SuppliesRow[] };

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

  return (
    <>
      <Navigation />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="menu-wrapper">
          {suppliesData.inv?.map((item: any[]) => (
            <SupplyItem key={item[0]} item={item} setReload={setReload} />
          ))}
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Supplies;
