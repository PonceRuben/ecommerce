import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="bg-[#01141f] text-white border-t-2 border-[#02333c] py-6 border-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          {/* Logo y Derechos */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-white">Ecommerce</h2>
            <p className="text-sm text-gray-400 mt-2">
              © {new Date().getFullYear()} Ecommerce. Todos los derechos
              reservados.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <ul className="flex gap-6 text-sm text-gray-300">
            <li className="hover:text-[#03424a] transition-colors">
              <Link href="/privacy-policy">Política de privacidad</Link>
            </li>
            <li className="hover:text-[#03424a] transition-colors">
              <Link href="/terms">Términos y condiciones</Link>
            </li>
            <li className="hover:text-[#03424a] transition-colors">
              <Link href="/contact">Contacto</Link>
            </li>
          </ul>

          {/* Redes sociales */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-[#03424a] transition-colors"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#03424a] transition-colors"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#03424a] transition-colors"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
