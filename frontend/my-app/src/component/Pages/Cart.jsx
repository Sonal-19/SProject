import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
  const [cart, setCart] = useState({ products: [] });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3059/users/api/getCart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      //.then((response) => setCart(response.data.data))
      .then((response) => {
        setCart(response.data.data);
        // Assuming the product data is available in the response
        setProducts(response.data.data.products);
      })
      .catch((error) => console.error("Error fetching cart products:", error));
  }, []);

  const handleDeleteProduct = async (productId) => {
    console.log("Deleting product with ID:", productId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3059/users/api/deleteFromCart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCart((prevCart) => {
          const updatedProducts = prevCart.products.filter(
            (item) => item.productId !== productId
          );
          return { ...prevCart, products: updatedProducts };
        });

        // Remove selected size from local storage
        localStorage.removeItem(`selectedSize_${productId}`);

        alert("Product removed from cart");
      } else {
        alert("Error removing product");
      }
    } catch (error) {
      console.log("Error removing product", error);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3059/users/api/updateCartItem/${productId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setCart(response.data);
        console.log("Quantity updated successfully");
      } else {
        alert("Error updating quantity");
      }
    } catch (error) {
      console.log("Error updating quantity", error);
    }
  };

  const handleSizeChange = async (productId, newSize) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3059/users/api/updateCartItemSize/${productId}`,
        {
          size: newSize,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setCart(response.data);
        console.log("Size updated successfully");
      } else {
        alert("Error updating size");
      }
    } catch (error) {
      console.log("Error updating size", error);
    }
  };

  const handleCheckboxChange = (productId) => {
    const updatedSelectedProducts = selectedProducts.includes(productId)
      ? selectedProducts.filter((id) => id !== productId)
      : [...selectedProducts, productId];
    setSelectedProducts(updatedSelectedProducts);
    calculateTotalPrice(cart.products, updatedSelectedProducts);
  };

  // const calculateTotalPrice = (products, selectedProductsList) => {
  //   const selectedProductsToCalculate = selectedProductsList || selectedProducts;
  //   const total = products.reduce((sum, product) => {
  //     if (selectedProductsToCalculate.includes(product.productId)) {
  //       return sum + product.price * product.quantity;
  //     }
  //     return sum;
  //   }, 0);
  //   setTotalPrice(total);

  //   const calculatedDiscount = total * 0.3;
  //   setDiscount(calculatedDiscount);

  //   const calculatedFinalPrice = total - calculatedDiscount;
  //   setFinalPrice(calculatedFinalPrice);
  // };


  const calculateTotalPrice = (cartProducts, selectedProductsList) => {
    const selectedProductsToCalculate = selectedProductsList || selectedProducts;
    const total = cartProducts.reduce((sum, cartProduct) => {
      const matchingProduct = products.find(
        (product) => product.productId === cartProduct.productId
      );

      if (
        matchingProduct &&
        selectedProductsToCalculate.includes(matchingProduct.productId)
      ) {
        return sum + matchingProduct.price * cartProduct.quantity;
      }
      return sum;
    }, 0);

    setTotalPrice(total);

    const calculatedDiscount = total * 0.3;
    setDiscount(calculatedDiscount);

    const calculatedFinalPrice = total - calculatedDiscount;
    setFinalPrice(calculatedFinalPrice);
  };


  return (
    <>
      <div className="container ">
        <div className="mt-5 ps-3 row">
          <h2 className="text-bold font-monospace">Shopping Cart</h2>
          <div className="col-lg-6 pe-3">
          {cart && cart.products && cart.products.map((item) => (
            <div key={item.productId} className="cart-card">
              <div className="card h-100 d-flex justify-content-center">
                <div className="row">
                  {/* Image Column */}
                  <div className="col-md-4 col-4">
                    <div className="position-relative  cart-img">
                    <input className="btn btn-sm btn-light position-absolute top-0 start-0 m-2 rounded-circle"
                          type="checkbox"
                          checked={selectedProducts.includes(item.productId)}
                          onChange={() => handleCheckboxChange(item.productId)}
                        />
                      <img
                        src={`http://localhost:3059/${item.image}`}
                        alt={`${item.name}'s Profile`}
                        className="card-img view-img h-100"
                        //className="card-img-top BeerListItem-img"
                      />
                    </div>
                  </div>
                  {/* Details Column */}
                  <div className="col-md-6 col-6 d-flex justify-content-between">
                    <div className="col-txt cd-by">
                      <div className="card-body">
                        <h5 className="card-title mb-2">{item.name}</h5>
                        <p className="card-text">
                          <strong>{item.category}</strong>{" "}
                        </p>
                      <p className="card-text mb-2">
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
                      {/* <div className="d-flex ms-2 ps-2">
                        <div className="me-2">
                            <select
                              style={{ fontStyle: "italic" }}
                              className="form-select me-2"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.productId,
                                  parseInt(e.target.value, 10)
                                )
                              }
                            >
                              {[1, 2, 3, 4].map((value) => (
                                <option key={value} value={value}>
                                  Qty: {value}
                                </option>
                              ))}
                            </select>
                        </div>
                        <div>
                            <select
                              style={{ fontStyle: "italic" }}
                              className="form-select"
                              value={item.size}
                              onChange={(e) =>
                                handleSizeChange(item.productId, e.target.value)
                              }
                            >
                              {["S", "M", "L"].map((size) => (
                                <option key={size} value={size}>
                                  Size: {size}
                                </option>
                              ))}
                            </select>
                        </div>
                      </div> */}
                      <div className="ms-2 ps-2">
                        <div className="mb-2">
                            <select
                              style={{ fontStyle: "italic" }}
                              className="form-select"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.productId,
                                  parseInt(e.target.value, 10)
                                )
                              }
                            >
                              {[1, 2, 3, 4].map((value) => (
                                <option key={value} value={value}>
                                  Qty: {value}
                                </option>
                              ))}
                            </select>
                        </div>
                        <div>
                            <select
                              style={{ fontStyle: "italic" }}
                              className="form-select"
                              value={item.size}
                              onChange={(e) =>
                                handleSizeChange(item.productId, e.target.value)
                              }
                            >
                              {["S", "M", "L"].map((size) => (
                                <option key={size} value={size}>
                                  Size: {size}
                                </option>
                              ))}
                            </select>
                        </div>
                      </div>
                    </div>
                    <div className="pt-0 p-3 ms-3 me-3 text-center">
                      <button
                        className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle"
                        onClick={() => handleDeleteProduct(item.productId)}
                      >
                        <FontAwesomeIcon icon={faTimes}  />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
          <div className="col-lg-4 p-2">
            <div className="card price-list p-3">
              <div className="row">
                <p className="price-title">Price Details</p>
                <div className="row row">
                  <div className='col-6'><span>Total Price:</span></div>
                  <div className="col-6 text-end">
                    <span> ₹ {totalPrice}</span>
                  </div>
                </div>
                <div className='row prow'>
                  <div className='col-6'><span>Discount:</span></div>
                  <div className='col-6 text-end text-success'><span>- ₹ {discount}</span></div>
                </div>
                <div className="row row ">
                  <div className="col-6">
                    <span>Final Price: </span>
                  </div>
                  <div className="col-6 text-end">
                    <span>₹ {finalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
