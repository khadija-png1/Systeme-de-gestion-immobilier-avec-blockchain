import { useEffect, useState } from "react";

import { getAllRentals } from "../services/api";

import Layout from "../components/Layout";

import "../style/Dashboard.css";

export default function Dashboard() {

   const [rentals, setRentals] = useState([]);

   useEffect(() => {
      loadData();
   }, []);

   const loadData = async () => {
      try {
         const res = await getAllRentals();

         setRentals(res?.data?.data || []);

      } catch (error) {
         console.log(error);
      }
   };

   return (
      <Layout>

         <h1 className="dashboard-title">
            Rental Dashboard
         </h1>

         {rentals.map((r, i) => (

            <div key={i} className="rental-card">

               <p>
                  <strong>Tenant:</strong> {r.tenant}
               </p>

               <p>
                  <strong>Rent:</strong> {r.rent}
               </p>

               <p>
                  <strong>PDF Hash:</strong> {r.pdf_hash}
               </p>

               <p>
                  <strong>Transaction:</strong> {r.tx_hash}
               </p>

            </div>

         ))}

      </Layout>
   );
}