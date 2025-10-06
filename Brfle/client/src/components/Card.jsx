export default function Card({ title, children }) {
  return (
    <div className="card">
      {title && <h2 className="text-2xl mb-4">{title}</h2>}
      {children}
    </div>
  );
}
