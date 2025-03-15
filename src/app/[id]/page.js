export default function TokoPage({ params }) {
  const { id } = params; // Dapatkan ID dari URL

  if (!id) return <p>Loading...</p>;

  return (
    <div className="text-center">
      Cooming Soon
    </div>
  );
}
