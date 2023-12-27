import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { productId } = useParams();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productPreviousPrice, setProductPreviousPrice] = useState("");
  const [productOffer, setProductOffer] = useState("");
  const[productSizes, setProductSizes] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productImagePrev, setProductImagePrev] = useState(null);

  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Product ID:", productId);
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3059/users/api/viewproducts/${productId}`
        );
        const product = response.data;
        setProductName(product.name);
        setProductPrice(product.price);
        setProductPreviousPrice(product.previousPrice);
        setProductOffer(product.offer);
        setProductSizes(product.sizes);
        setProductImage(product.image);
        setProductDescription(product.description);
        setProductCategory(product.category);
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleEditProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("price", parseFloat(productPrice));
      formData.append("previousPrice", parseFloat(productPreviousPrice));
      formData.append("offer", parseFloat(productOffer));
      formData.append("sizes", productSizes);
      formData.append("description", productDescription);
      formData.append("category", productCategory);
      if (productImage) {
        formData.append("image", productImage);
      }

      const response = await axios.put(
        `http://localhost:3059/users/api/editproduct/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        window.alert("Product updated successfully");
        navigate("/allproducts");
      } else {
        console.log("Edit failed. Please check your information.");
      }
    } catch (error) {
      console.error("Error editing product:", error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    setProductImagePrev(URL.createObjectURL(file));
  };

  const handleCancelEdit = () => {
    navigate("/allproducts");
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-bold font-monospace text-center m-2">
          Edit Product
        </h2>
        <div className="cardA rounded bg-white border shadow p-4 mb-3">
          <form className="row g-3">
            <div className="col-12">
              <label className="form-label">Name </label>
              <input
                className="form-control"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Price </label>
              <input
                className="form-control"
                type="text"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Previous Price </label>
              <input
                className="form-control"
                type="text"
                value={productPreviousPrice}
                onChange={(e) => setProductPreviousPrice(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Offer (%) </label>
              <input
                className="form-control"
                type="text"
                value={productOffer}
                onChange={(e) => setProductOffer(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Description </label>
              <input
                className="form-control"
                type="text"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Category </label>
              <select
                className="form-control"
                name="category"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              >
                <option value="book">Book</option>
                <option value="child">Child</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
            <div className="col-12">
                  <label htmlFor="sizes">Sizes:</label>
                  <input
                    type="text"
                    id="sizes"
                    name="sizes"
                    value={productSizes}
                onChange={(e) => setProductSizes(e.target.value)}
                    />
            </div>
            <div className="col-12">
              <label className="form-label">Image </label>
              <input
                className="form-control"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="col-12 text-center">
              {/* <label className="form-label">Image</label> */}
              {productImagePrev ? (
                <>
                  <img
                    src={productImagePrev}
                    alt={`${productImagePrev}'s Profile`}
                    className="img-thumbnail"
                    style={{ width: "100px", height: "100px" }}
                  />
                </>
              ) : (
                <>
                  <img
                    src={`http://localhost:3059/${productImage}`}
                    alt={`${productImage}'s Profile`}
                    className="img-thumbnail"
                    style={{ width: "100px", height: "100px" }}
                  />
                </>
              )}
            </div>
            <div className="col-12 mt-4 text-center">
            <button
                className="btn btnA me-4"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="btn btnA"
                type="button"
                onClick={handleEditProduct}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
