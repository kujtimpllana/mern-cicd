export default function ProductList({ products, onDelete }) {
  return (
    <ul>
      {products.map((p) => (
        <li key={p._id}>
          <strong>{p.name}</strong> - ${p.price}
          <button
            onClick={() => onDelete(p._id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
