const API_URL = "http://localhost:5000/api/products";

export const getProducts = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const addProduct = async (product) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
};

export const deleteProduct = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
