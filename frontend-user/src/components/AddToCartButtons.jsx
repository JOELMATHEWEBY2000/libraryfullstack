import { useNavigate } from "react-router-dom";
import cartApi from "../api/cartApi";
import "./AddToCartButtons.css";

export default function AddToCartButtons({ bookId }) {
  const navigate = useNavigate();

  const handlePurchase = async () => {
    try {
      await cartApi.addToPurchaseCart(bookId, 1);
      navigate("/cart");
    } catch (err) {
      console.error("Failed to add to purchase cart", err);
    }
  };

  const handleRent = async (days) => {
    try {
      await cartApi.addToRentalCart(bookId, days);
      navigate("/cart");
    } catch (err) {
      console.error("Failed to add to rental cart", err);
    }
  };

  return (
    <div className="cart-actions">
      <button className="btn-buy" onClick={handlePurchase}>
        Buy
      </button>

      <button className="btn-rent" onClick={() => handleRent(7)}>
        Rent 7 Days
      </button>

      <button className="btn-rent" onClick={() => handleRent(14)}>
        Rent 14 Days
      </button>
    </div>
  );
}
