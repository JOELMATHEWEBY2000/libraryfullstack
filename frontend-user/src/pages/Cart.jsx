import { useEffect, useState } from "react";
import cartApi from "../api/cartApi";
import "./Cart.css";
import CheckoutButton from "../components/CheckoutButton";

export default function Cart() {
  const [purchaseCart, setPurchaseCart] = useState([]);
  const [rentalCart, setRentalCart] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD CART ================= */

  const loadCart = async () => {
    try {
      const purchaseRes = await cartApi.getPurchaseCart();
      const rentalRes = await cartApi.getRentalCart();

      // support both axios + fetch styles
      setPurchaseCart(purchaseRes?.data || purchaseRes || []);
      setRentalCart(rentalRes?.data || rentalRes || []);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  /* ================= REMOVE ================= */

 const removePurchase = async (id) => {
  await cartApi.removePurchaseItem(id);
  loadCart(); // 🔥 THIS IS REQUIRED
};

 const removeRental = async (id) => {
  await cartApi.removeRentalItem(id);
  loadCart();
};


  /* ================= PURCHASE QTY ================= */

  const increasePurchaseQty = async (bookId) => {
    await cartApi.addToPurchaseCart(bookId, 1);
    loadCart();
  };

  const decreasePurchaseQty = async (item) => {
    if (item.quantity <= 1) {
      await removePurchase(item.id);
    } else {
      await cartApi.updatePurchaseQty(item.id, item.quantity - 1);
      loadCart();
    }
  };

  /* ================= RENTAL DAYS ================= */

  const increaseRentalDays = async (item) => {
    await cartApi.updateRentalDays(item.id, item.duration + 1);
    loadCart();
  };

  const decreaseRentalDays = async (item) => {
    if (item.duration <= 1) {
      await removeRental(item.id);
    } else {
      await cartApi.updateRentalDays(item.id, item.duration - 1);
      loadCart();
    }
  };

  /* ================= TOTALS ================= */

 const purchaseTotal = purchaseCart.reduce(
  (sum, item) => sum + Number(item.subtotal || 0),
  0
);

 const rentalTotal = rentalCart.reduce(
  (sum, item) => sum + Number(item.subtotal || 0),
  0
);



  const grandTotal = purchaseTotal + rentalTotal;

  /* ================= UI ================= */

  if (loading) {
    return <p className="cart-loading">Loading cart...</p>;
  }

  return (
    <div className="cart-container">
      <h1 className="cart-page-title">My Cart</h1>

      {/* ================= PURCHASE CART ================= */}
      <h2 className="cart-title">Purchase Cart</h2>

      {purchaseCart.length === 0 && (
        <p className="cart-empty">No purchase items</p>
      )}

      {purchaseCart.map((item) => {
        const qty = Number(item.quantity || 1);

        return (
          <div className="cart-item" key={item.id}>
            <img
              src={item.book?.cover_image}
              alt={item.book?.title}
              className="cart-book-img"
            />

            <div className="cart-item-info">
              <h4>{item.title}</h4>
              <p className="cart-author">{item.book?.title}</p>
              <p>Price: ₹{item.book?.price}</p>

              <div className="qty-controls">
                <button onClick={() => decreasePurchaseQty(item)}>-</button>
                <span>{qty}</span>
                <button onClick={() => increasePurchaseQty(item.book.id)}>
                  +
                </button>
              </div>

              <p className="cart-subtotal">
                Subtotal: ₹{item.subtotal}
              </p>
            </div>

            <button
              className="cart-remove-btn"
              onClick={() => removePurchase(item.id)}
            >
              Remove
            </button>
          </div>
        );
      })}

      {purchaseCart.length > 0 && (
        <div className="cart-summary">
          <strong>Purchase Total: ₹{purchaseTotal}</strong>
        </div>
      )}

      {/* ================= RENTAL CART ================= */}
      <h2 className="cart-title">Rental Cart</h2>

      {rentalCart.length === 0 && (
        <p className="cart-empty">No rental items</p>
      )}

      {rentalCart.map((item) => {
        const days = Number(item.duration || 1);

        return (
          <div className="cart-item" key={item.id}>
            <img
              src={item.book?.cover_image}
              alt={item.book?.title}
              className="cart-book-img"
            />

            <div className="cart-item-info">
              <h4>{item.title}</h4>
              <p className="cart-author">{item.book?.title}</p>
              <p>Rental / Day: ₹{item.book?.rental_price_per_day}</p>

              <div className="qty-controls">
                <button onClick={() => decreaseRentalDays(item)}>-</button>
                <span>{days} days</span>
                <button onClick={() => increaseRentalDays(item)}>+</button>
              </div>

              <p>
                From: {item.start_date} <br />
                To: {item.expiry_date}
              </p>

              <p className="cart-subtotal">
                Subtotal: ₹{item.subtotal}
              </p>
            </div>

            <button
              className="cart-remove-btn"
              onClick={() => removeRental(item.id)}
            >
              Remove
            </button>
          </div>
        );
      })}

      {rentalCart.length > 0 && (
        <div className="cart-summary">
          <strong>Rental Total: ₹{rentalTotal}</strong>
        </div>
      )}

      {/* ================= GRAND TOTAL ================= */}
      {(purchaseCart.length > 0 || rentalCart.length > 0) && (
        <div className="cart-grand-total">
          <h2>Grand Total: ₹{grandTotal}</h2>
          <button className="cart-checkout-btn">
            <CheckoutButton amount={grandTotal} />
          </button>
        </div>
      )}
    </div>
  );
}
