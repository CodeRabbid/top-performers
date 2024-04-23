import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useAllPurchasesMutation } from "../slices/api/purchaseApiSlice.js";

const PurchaseScreen = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [purchases, setPurchases] = useState();
  // const purchases = {
  //   customer_id: 1,
  //   product_id: 1,
  //   purchase_time: "2022-02-22T21:00:00.000Z",
  // };

  const [allPurchases, { isLoading }] = useAllPurchasesMutation();

  useEffect(() => {
    (async () => {
      const result = await allPurchases().unwrap();
      setPurchases(result.purchase);
      console.log(result.purchase);
    })();
  }, []);

  return (
    <Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Purchase Date</th>
            <th>Gender</th>
            <th>Birthday</th>
            <th>Type</th>
            <th>Model</th>
            <th>Brand</th>
          </tr>
        </thead>
        <tbody>
          {purchases ? (
            purchases.map((purchase) => (
              <tr>
                <td>{purchase.purchase_time}</td>
                <td>{purchase.gender}</td>
                <td>{purchase.birthday}</td>
                <td>{purchase.type}</td>
                <td>{purchase.model}</td>
                <td>{purchase.brand}</td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default PurchaseScreen;
