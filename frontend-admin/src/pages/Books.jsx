import { useEffect, useState } from "react";
import booksApi from "../api/booksApi";
import "./Books.css";


export default function Books() {
  const [books, setBooks] = useState([]);

  // --- Add Form ---
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [rental_price_per_day, setRentalPrice] = useState("");
  const [stock_quantity, setStock] = useState("");
  const [rented_quantity, setRentedQty] = useState("");
  const [cover_image, setCover] = useState(null);

  // --- Edit Form ---
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCover, setEditCover] = useState(null);

  // ====================================================
  // LOAD BOOKS
  // ====================================================
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await booksApi.getBooks();
      setBooks(res.data);
    } catch (err) {
      console.error("Error loading books:", err);
    }
  };

  // ====================================================
  // ADD BOOK
  // ====================================================
  const addBook = async () => {
    const form = new FormData();
    form.append("title", title);
    form.append("author", author);
    form.append("isbn", isbn);
    form.append("category", category);
    form.append("price", price);
    form.append("rental_price_per_day", rental_price_per_day );
    form.append("stock_quantity",stock_quantity);
    form.append("rented_quantity",rented_quantity);
    if (cover_image) form.append("cover_image", cover_image);

    try {
      await booksApi.addBook(form);
      alert("Book added!");
      loadBooks();
    } catch (err) {
      console.error("Add book error:", err);
      alert("Could not add book.");
    }
  };

  // ====================================================
  // DELETE BOOK
  // ====================================================
  const deleteBook = async (id) => {
    if (!window.confirm("Delete this book permanently?")) return;

    try {
      await booksApi.deleteBook(id);
      loadBooks();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ====================================================
  // OPEN EDIT MODAL
  // ====================================================
  const openEditModal = (book) => {
    setEditing(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category);
    setEditPrice(book.price);
    setEditStock(book.stock_quantity);
    setEditCover(null);
  };

  // ====================================================
  // SAVE EDIT
  // ====================================================
  const saveEdit = async () => {
    const form = new FormData();
    form.append("title", editTitle);
    form.append("author", editAuthor);
    form.append("category", editCategory);
    form.append("price", editPrice);
    form.append("stock_quantity", editStock);

    if (editCover) form.append("cover_image", editCover);

    try {
      await booksApi.updateBook(editing.id, form);
      alert("Book updated!");
      setEditing(null);
      loadBooks();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update book.");
    }
  };

  // ====================================================
  // RENDER UI
  // ====================================================
  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Book Management</h1>

      {/* ADD FORM */}
      <h2>Add New Book</h2>
      <div style={{ marginBottom: "20px" }}>
        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <input
          placeholder="Author"
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input placeholder="ISBN" onChange={(e) => setIsbn(e.target.value)} />
        <input
          placeholder="Category"
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          placeholder="Price"
          type="number"
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          placeholder="Rental Price/Day"
          type="number"
          onChange={(e) => setRentalPrice(e.target.value)}
        />
        <input
          placeholder="Stock"
          type="number"
          onChange={(e) => setStock(e.target.value)}
        />
        <input
          placeholder="Rental Quantity"
          type="number"
          onChange={(e) => setRentedQty(e.target.value)}
        />
        <input type="file" onChange={(e) => setCover(e.target.files[0])} />
        <button onClick={addBook}>Add Book</button>
      </div>

      {/* BOOK TABLE */}
      <h2>All Books</h2>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", color: "white" }}>
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      width="50"
                      alt="book cover"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.price}</td>
                <td>{book.stock_quantity}</td>

                <td>
                  <button onClick={() => openEditModal(book)}>Edit</button>
                </td>
                <td>
                  <button
                    onClick={() => deleteBook(book.id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "30%",
            width: "40%",
            padding: "20px",
            background: "#222",
            border: "1px solid white",
            zIndex: 1000,
          }}
        >
          <h2>Edit Book</h2>

          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <input
            value={editAuthor}
            onChange={(e) => setEditAuthor(e.target.value)}
          />
          <input
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
          />
          <input
            value={editPrice}
            type="number"
            onChange={(e) => setEditPrice(e.target.value)}
          />
          <input
            value={editStock}
            type="number"
            onChange={(e) => setEditStock(e.target.value)}
          />

          <p>Change Cover (optional):</p>
          <input type="file" onChange={(e) => setEditCover(e.target.files[0])} />

          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditing(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
