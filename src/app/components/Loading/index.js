// components/Loading.js
import './loading.scss';

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Sedang Memuat...</p>
    </div>
  );
}
