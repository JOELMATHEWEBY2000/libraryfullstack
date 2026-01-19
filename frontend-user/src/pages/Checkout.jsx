import { useEffect, useState } from "react";
import cartApi from "../api/cartApi";
import "./Checkout.css";

export default function Checkout() {
  const [purchaseCart, setPurchaseCart] = useState([]);
  const [rentalCart, setRentalCart] = useState([]);
  const [summary, setSummary] = useState({
    rental_total: 0,
    purchase_total: 0,
    grand_total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const p = await cartApi.getPurchaseCart();
      const r = await cartApi.getRentalCart();
      const s = await cartApi.getCartSummary(); // ✅ NEW

      setPurchaseCart(p.data || []);
      setRentalCart(r.data || []);
      setSummary(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading checkout...</p>;

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <section>
        <h3>Order Summary</h3>

        {purchaseCart.map((i) => (
          <p key={i.id}>
            {i.book.title} × {i.quantity} — ₹{i.subtotal}
          </p>
        ))}

        {rentalCart.map((i) => (
          <p key={i.id}>
            {i.book.title} (Rental) — ₹{i.subtotal}
          </p>
        ))}

        {/* ✅ BACKEND-TRUSTED TOTAL */}
        <h2>Total Payable: ₹{summary.grand_total}</h2>
      </section>

      <section className="payment-section">
        <h3>Select Payment Method</h3>

        <button className="pay-btn">Pay with Razorpay</button>
        <button className="pay-btn stripe">Pay with Card (Stripe)</button>
      </section>
    </div>
  );
}
