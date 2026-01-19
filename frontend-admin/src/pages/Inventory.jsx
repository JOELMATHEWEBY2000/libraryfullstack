import { useEffect, useState } from "react";
import inventoryApi from "../api/inventoryApi";
import "./Inventory.css";

export default function Inventory() {
  const [books, setBooks] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await inventoryApi.getInventory();
      const data = res.data || [];

      // add available field
      const computed = data.map(b => ({
        ...b,
        available: b.stock_quantity - b.rented_quantity
      }));

      setBooks(computed);
      setLowStock(computed.filter(b => b.stock_quantity < 5));
    } catch (err) {
      console.error("Inventory load failed", err);
    }
  };

  return (
    <div className="inventory-container">
      <h1>Inventory Management</h1>

      {/* LOW STOCK */}
      <section>
        <h2>Low Stock (Less than 5)</h2>

        <div className="table-wrapper desktop-only">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Stock</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map(b => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.stock_quantity}</td>
                  <td>{b.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="card-grid mobile-only">
          {lowStock.map(b => (
            <div className="card" key={b.id}>
              <h4>{b.title}</h4>
              <p><strong>Stock:</strong> {b.stock_quantity}</p>
              <p><strong>Available:</strong> {b.available}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ALL INVENTORY */}
      <section>
        <h2>All Inventory</h2>

        <div className="table-wrapper desktop-only">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Stock</th>
                <th>Rented</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.stock_quantity}</td>
                  <td>{b.rented_quantity}</td>
                  <td>{b.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="card-grid mobile-only">
          {books.map(b => (
            <div className="card" key={b.id}>
              <h4>{b.title}</h4>
              <p><strong>Stock:</strong> {b.stock_quantity}</p>
              <p><strong>Rented:</strong> {b.rented_quantity}</p>
              <p><strong>Available:</strong> {b.available}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
