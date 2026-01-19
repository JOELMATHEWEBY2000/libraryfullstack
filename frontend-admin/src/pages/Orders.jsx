import { useEffect, useState } from "react";
import ordersApi from "../api/ordersApi";
import "./Orders.css";

export default function Orders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [rentalOrders, setRentalOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    try {
      const [purchaseRes, rentalRes] = await Promise.all([
        ordersApi.getPurchaseOrders(),
        ordersApi.getRentalOrders(),
      ]);

      setPurchaseOrders(purchaseRes.data || []);
      setRentalOrders(rentalRes.data || []);
    } catch (err) {
      console.error("Error loading orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return <div className="orders-container">Loading orders...</div>;
  }

  return (
    <div className="orders-container">
      <h1>Orders</h1>

      {/* ================= PURCHASE ORDERS ================= */}
      <h2>Purchase Orders</h2>
      <table className="orders-table">
  <thead>
    <tr>
      <th>Order ID</th>
      <th>Book</th>
      <th>Author</th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Subtotal</th>
      <th>Purchased At</th>
    </tr>
  </thead>

  <tbody>
    {purchaseOrders.length === 0 ? (
      <tr>
        <td colSpan="7">No purchase orders found</td>
      </tr>
    ) : (
      purchaseOrders.map((order) => (
        <tr key={order.id}>
          <td>#{order.id}</td>
          <td>{order.book.title}</td>
          <td>{order.book.author}</td>
          <td>₹{order.book.price}</td>
          <td>{order.quantity}</td>
          <td>₹{order.subtotal}</td>
          <td>{new Date(order.added_at).toLocaleString()}</td>
        </tr>
      ))
    )}
  </tbody>
</table>


      {/* ================= RENTAL ORDERS ================= */}
      <h2>Rental Orders</h2>
      <table className="orders-table">
  <thead>
    <tr>
      <th>Order ID</th>
      <th>Book</th>
      <th>Author</th>
      <th>Rent / Day</th>
      <th>Duration (Days)</th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Subtotal</th>
    </tr>
  </thead>

  <tbody>
    {rentalOrders.length === 0 ? (
      <tr>
        <td colSpan="8">No rental orders found</td>
      </tr>
    ) : (
      rentalOrders.map((order) => (
        <tr key={order.id}>
          <td>#{order.id}</td>
          <td>{order.book.title}</td>
          <td>{order.book.author}</td>
          <td>₹{order.book.rental_price_per_day}</td>
          <td>{order.duration}</td>
          <td>{order.start_date}</td>
          <td>{order.expiry_date}</td>
          <td>₹{order.subtotal}</td>
        </tr>
      ))
    )}
  </tbody>
</table>
  </div>
  );
}
