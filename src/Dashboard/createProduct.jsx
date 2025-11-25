import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const CreateProduct = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "NGN",
    sizes: "",
    defaultSize: "",
    colors: "",
    defaultColor: "",
    bestSeller: false,
    subcategory: "",
    rating: 0,
    discount: 0,
    newArrival: false,
    tags: "",
    categoryid: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      sizes: formData.sizes.split(",").map((s) => s.trim()),
      colors: formData.colors.split(",").map((c) => c.trim()),
      tags: formData.tags.split(",").map((t) => t.trim()),
    };

    try {
      const res = await fetch("http://localhost:5000/createProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Product created successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          currency: "NGN",
          sizes: "",
          defaultSize: "",
          colors: "",
          defaultColor: "",
          bestSeller: false,
          subcategory: "",
          rating: 0,
          discount: 0,
          newArrival: false,
          tags: "",
          categoryid: "",
        });
        if (closeModal) closeModal(); // Close modal on success
      } else {
        toast.error(data.message || "Failed to create product");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Add New Product</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-auto"
        onSubmit={handleSubmit}
      >
        <input
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />
        <input
          name="subcategory"
          placeholder="Subcategory"
          value={formData.subcategory}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          className="border rounded p-2 col-span-1 md:col-span-2 focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />
        <input
          name="currency"
          placeholder="Currency"
          value={formData.currency}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />
        <input
          name="sizes"
          placeholder="Sizes (comma-separated)"
          value={formData.sizes}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />
        <input
          name="defaultSize"
          placeholder="Default Size"
          value={formData.defaultSize}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />
        <input
          name="colors"
          placeholder="Colors (comma-separated)"
          value={formData.colors}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />
        <input
          name="defaultColor"
          placeholder="Default Color"
          value={formData.defaultColor}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount"
          value={formData.discount}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />
        <input
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          name="categoryid"
          placeholder="Category ID"
          value={formData.categoryid}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-primary"
        />

        <div className="flex gap-4 col-span-1 md:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bestSeller"
              checked={formData.bestSeller}
              onChange={handleChange}
            />
            Best Seller
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="newArrival"
              checked={formData.newArrival}
              onChange={handleChange}
            />
            New Arrival
          </label>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 col-span-1 md:col-span-2 rounded hover:bg-primary-dark transition"
        >
          Create Product
        </button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default CreateProduct;