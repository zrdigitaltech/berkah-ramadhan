'use client';

export default function Index() {
  return (
    <footer>
      <h3>Beli Sebelum Kehabisan!</h3>
      {/* <p> Makanan enak buat mood kamu makin semangat lagi</p> */}
      <p className="copyright-text">
        <small>
          Copyright &copy; 2022 - {new Date().getFullYear()}{' '}
          <a href="https://zrdevelopers.github.io/" target="_blank" className="text-primary">
            ZRDevelopers
          </a>
          . All rights reserved
        </small>
      </p>
    </footer>
  );
}
