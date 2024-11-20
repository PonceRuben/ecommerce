import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';

export default function NavBar() {
    return(
        <>
            <nav className="text-[#7d677e] bg-[#360b41]">
                <div className="flex p-4"><h1 className="mr-10 text-4xl"><Link href='/'>Ecommerce</Link></h1>
                    <div className="relative items-center w-80 flex">
                        <input type="text" placeholder="Buscar producto..." className="w-full py-[4px] pr-10 pl-[4px] border border-solid border-[#ccc] rounded-2xl outline-none text-base"></input>
                        <button className="absolute top-1/3 right-[10px] transform-[translateY]"><FaSearch/></button>
                    </div>
                </div>
                <ul className="flex gap-12 p-4 ml-5 text-1xl">
                    <li><Link href='/categorias/[categoria]' as={`/categorias/ropa`}>Categorias</Link></li>
                    <li>Metodos de pago</li>
                    <li>Envíos</li>
                    <li>Ofertas</li>
                    <li>Favoritos</li>
                </ul>   
            </nav> 
        </>
    );
}