import { useNavigate } from "react-router-dom";
import "./CheckoutButton.css"

export default function CheckoutButton({ amount }) {
  const navigate = useNavigate();

  return (
    <button
      className="checkout-btn"
      disabled={amount <= 0}
      onClick={() => navigate("/checkout")}
    >
      Proceed to Checkout
    </button>
  );
}
