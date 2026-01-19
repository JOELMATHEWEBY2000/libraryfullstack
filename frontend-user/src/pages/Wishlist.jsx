import { useEffect, useState } from "react";
import {
  getWishlist,
  deleteWishlistItem,
  updateWishlistItem,
  toggleWishlist,
  addWishlistItem,
} from "../api/wishlistApi";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState(1);

  // NEW STATES FOR ADDING
  const [newBookId, setNewBookId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    getWishlist()
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Failed to load wishlist", err));
  };

  const handleRemove = (id) => {
    deleteWishlistItem(id)
      .then(loadWishlist)
      .catch((err) => console.error("Remove error", err));
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setNote(item.note || "");
    setPriority(item.priority || 1);
  };

  const handleSave = (id) => {
    updateWishlistItem(id, { note, priority })
      .then(() => {
        setEditingItem(null);
        loadWishlist();
      })
      .catch((err) => console.error("Update error", err));
  };

  const handleToggle = (bookId) => {
    toggleWishlist(bookId).then(loadWishlist);
  };

  // NEW — HANDLE ADD
  const handleAddWishlist = () => {
  if (!newBookId.trim()) {
    alert("Enter a valid Book ID");
    return;
  }

  addWishlistItem(newBookId)
    .then(() => {
      setNewBookId("");
      loadWishlist();
      alert("Book added to wishlist!");
    })
    .catch((err) => {
      console.error("Add error", err);
      alert("Failed to add — check Book ID");
    });
};


  return (
    <div className="container mt-4">

      <h2 className="mb-4">Your Wishlist ❤️</h2>

      {/* -----------------------------
          ADD TO WISHLIST SECTION
      --------------------------------*/}
      <div className="card p-3 shadow mb-4" style={{ background: "#111", color: "#fff" }}>
        <h4>Add Book to Wishlist</h4>

        <div className="d-flex mt-3">
          <input
            type="number"
            className="form-control me-2"
            placeholder="Enter Book ID"
            value={newBookId}
            onChange={(e) => setNewBookId(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleAddWishlist}>
            Add
          </button>
        </div>

        <small className="text-muted mt-1">
          (You can also auto-add wishlist from Books page)
        </small>
      </div>

      {/* -----------------------------
          WISHLIST ITEMS LIST
      --------------------------------*/}
      {items.length === 0 ? (
        <h5>No items in wishlist.</h5>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="card mb-3 p-3 shadow-sm"
            style={{ background: "#111", color: "#fff" }}
          >
            <div className="d-flex justify-content-between align-items-center">

              {/* BOOK DETAILS */}
              <div
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/books/${item.book.id}`)}
              >
                <img
                  src={item.book.cover_image}
                  alt={item.book.title}
                  style={{
                    width: "80px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "15px",
                  }}
                />
                <div>
                  <h5>{item.book.title}</h5>
                  <p className="text-muted">{item.book.author}</p>
                  <p className="text-info">₹{item.book.price}</p>
                </div>
              </div>

              {/* ACTIONS */}
              <div>
                {editingItem === item.id ? (
                  <>
                    {/* NOTE INPUT */}
                    <input
                      className="form-control mb-2"
                      placeholder="Note..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />

                    {/* PRIORITY */}
                    <select
                      className="form-select mb-2"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="1">Low</option>
                      <option value="2">Medium</option>
                      <option value="3">High</option>
                    </select>

                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleSave(item.id)}
                    >
                      Save
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingItem(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-light btn-sm me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* TOGGLE BUTTON */}
            <button
              className="btn btn-outline-danger mt-3"
              onClick={() => handleToggle(item.book.id)}
            >
              ❤️ Remove from Wishlist
            </button>
          </div>
        ))
      )}
    </div>
  );
}
