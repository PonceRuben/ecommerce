"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";
import DashboardButton from "./DashboardButton";

export default function NavBar() {
  const { data: session } = useSession();
  return (
    <>
      <nav
        className="bg-[#01141f] text-white shadow-md"
        style={{ borderBottom: "2px solid #02333c" }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-white">
            <Link href="/">Ecommerce</Link>
          </h1>
        </div>

        {/* Navigation Links */}
        <ul className="flex justify-center gap-8 py-3 bg-[#02333c] items-center">
          <li className="hover:text-[#03424a] transition-colors flex items-center">
            <Link href="/categories/general" as="/categories/general">
              Categorías
            </Link>
          </li>
          <li className="hover:text-[#03424a] transition-colors flex items-center">
            <Link href="/">Catálogo</Link>
          </li>
          {!session && (
            <>
              <li className="hover:text-[#03424a] transition-colors flex items-center">
                <Link href="/login">Login</Link>
              </li>
              <li className="hover:text-[#03424a] transition-colors flex items-center">
                <Link href="/register">Register</Link>
              </li>
            </>
          )}
          {session && (
            <>
              <li className="hover:text-[#03424a] transition-colors flex items-center">
                <Link href="/cart">Ir al carrito</Link>
              </li>
              <li>
                <DashboardButton />
              </li>
              <li className="flex items-center">
                <LogoutButton />
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
