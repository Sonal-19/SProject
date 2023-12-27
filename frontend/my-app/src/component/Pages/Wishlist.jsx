import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import '../product/ViewProduct.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3059/users/api/getWishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlist(response.data.products);
      } catch (error) {
        console.error('Error fetching wishlist:', error.message);
      }
    };
    fetchWishlist();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:3059/users/api/addToCart",
        {
          productId,
          quantity: 1, // Set quantity to 1 for adding to cart
          size: "S", // Set default size or retrieve from user selection
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        const addedProduct = response.data.cart.products.find(
          (item) => item.productId === productId
        );
  
        if (addedProduct) {
          alert("Product added to cart successfully");
          setWishlist((prevWishlist) =>
            prevWishlist.filter((item) => item.productId !== productId)
          );
        } else {
          alert("Error adding product to cart");
        }
      } else {
        alert("Error adding product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:3059/users/api/removeFromWishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Product removed from wishlist successfully");
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item.productId !== productId));
      } else {
        alert("Error removing product from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-bold font-monospace text-center mt-5 pb-3">
          Your Wishlist <FontAwesomeIcon icon={faHeart} style={{ color: ' rgb(240, 33, 68)' }} />
        </h2>
        <div className="container pb-5 mb-5">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {wishlist.map((item) => (
              <div key={item.productId} className="col">
                <div className="cardP rounded bg-white border shadow m-3">
                  <div className="position-relative">
                    <button
                      className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle"
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <img
                      src={`http://localhost:3059/${item.image}`}
                      alt={`${item.name}'s Profile`}
                      className="card-img-top BeerListItem-img"
                    />
                  </div>
                  <div className="card-body font-monospace">
                    <h6 className="card-title m-2 text-center">{item.name}</h6>
                    <p className="card-text text-center mb-2">
                      <strong>₹{item.price}</strong>{" "}
                      <span className="discounted-price">
                        {item.previousPrice && (
                          <span>
                            <s className="text-secondary text-sm">
                              ₹{item.previousPrice}
                            </s>{" "}
                            <span className="discount-percentage text-warning text-sm">
                              ({Math.round(
                                ((item.previousPrice - item.price) /
                                  item.previousPrice) *
                                  100
                              )}
                            % OFF)
                            </span>
                          </span>
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="p-3 text-center">
                    <Link to="/cart">
                      <button className="btn btn-sm btn-warning w-100" onClick={() => handleAddToCart(item.productId)}>
                        Move to Cart
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
