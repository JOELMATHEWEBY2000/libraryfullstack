import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookDetails } from "../api/booksApi";
import { getBookReviews, addBookReview } from "../api/reviewsApi";
import AddToCartButtons from "../components/AddToCartButtons";

export default function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [form, setForm] = useState({
    rating: 5,
    comment: "",
  });

  /* ================= LOAD BOOK ================= */
  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await getBookDetails(id);
        setBook(res.data);
      } catch (err) {
        console.log("Error loading book:", err);
      }
    }

    fetchBook();
    loadReviews();
  }, [id]);

  /* ================= LOAD REVIEWS ================= */
  const loadReviews = async () => {
    try {
      const res = await getBookReviews(id);
      setReviews(res.data || []);
    } catch (err) {
      console.log("Error loading reviews:", err);
    }
  };

  /* ================= ADD REVIEW ================= */
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await addBookReview(id, form);
      setForm({ rating: 5, comment: "" });
      loadReviews();
    } catch (err) {
      console.log("Error submitting review:", err);
    }
  };

  if (!book) return <div style={{ padding: 20 }}>Loading…</div>;

  /* ================= AVG RATING ================= */
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "No ratings yet";

  return (
    <div style={{ padding: "40px", maxWidth: "900px" }}>
      <h1>{book.title}</h1>

      <img
        src={book.cover_image}
        alt={book.title}
        style={{ width: "300px", borderRadius: "10px", marginTop: "20px" }}
      />

      <h3 style={{ marginTop: "20px" }}>{book.author}</h3>
      <p><b>Category:</b> {book.category}</p>
      <p><b>ISBN:</b> {book.isbn}</p>
      <p><b>Price:</b> ₹{book.price}</p>
      <p><b>Rental Price/Day:</b> ₹{book.rental_price_per_day}</p>
      <p><b>Stock:</b> {book.stock_quantity}</p>
      <p><b>Rating:</b> ⭐ {avgRating}</p>

      {/* ADD TO CART */}
      <div style={{ marginTop: "20px" }}>
        <AddToCartButtons bookId={book.id} />
      </div>

      {/* ================= REVIEWS ================= */}
      <div style={{ marginTop: "40px" }}>
        <h2>Reviews</h2>

        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((r) => (
          <div
            key={r.id}
            style={{
              background: "#1e1e1e",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <strong>{r.user_name}</strong> ⭐ {r.rating}/5
            <p style={{ marginTop: "8px" }}>{r.comment}</p>
            <small>{new Date(r.created_at).toLocaleDateString()}</small>
          </div>
        ))}
      </div>

      {/* ================= ADD REVIEW ================= */}
      <div style={{ marginTop: "40px" }}>
        <h2>Add a Review</h2>

        <form onSubmit={submitReview}>
          <label>Rating</label><br />
          <select
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <br /><br />

          <label>Comment</label><br />
          <textarea
            value={form.comment}
            onChange={(e) =>
              setForm({ ...form, comment: e.target.value })
            }
            rows="4"
            style={{ width: "100%" }}
            placeholder="Write your review..."
          />

          <br /><br />

          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
}
