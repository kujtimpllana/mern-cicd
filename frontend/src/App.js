import { useEffect, useState } from "react";
import { getProducts, addProduct, deleteProduct } from "./api";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

function App() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAdd = async (product) => {
    await addProduct(product);
    loadProducts();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadProducts();
  };

  return (
    <div style={{ width: "400px", margin: "auto", paddingTop: "50px" }}>
      <h2>Product Manager</h2>
      <ProductForm onAdd={handleAdd} />
      <ProductList products={products} onDelete={handleDelete} />
    </div>
  );
}

export default App;
