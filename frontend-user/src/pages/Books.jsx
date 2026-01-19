import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../api/booksApi";

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await getBooks(); // GET /books/view
        setBooks(res.data);
      } catch (err) {
        console.error("Failed to load books", err);
      }
    }
    fetchBooks();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Available Books</h2>

      {/* If no books */}
      {books.length === 0 && (
        <p style={{ marginTop: 20 }}>No books available.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {books.map((book) => (
          <Link
            to={`/books/${book.id}`}
            key={book.id}
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            <div
              style={{
                background: "#111",
                padding: "15px",
                borderRadius: "10px",
                textAlign: "center",
                border: "1px solid #333",
              }}
            >
              <img
                src={book.cover_image}
                alt={book.title}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <h3 style={{ marginTop: "10px" }}>{book.title}</h3>
              <p style={{ color: "#ccc" }}>{book.author}</p>
              <p style={{ color: "#0af" }}>₹{book.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
