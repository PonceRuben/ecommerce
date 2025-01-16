import ProductCard from '@/app/components/ProductCard';
import Link from "next/link";





export default async function Categoria({
    params,
}: {
    params: { categoria: string };
}) {
    const categoria = decodeURIComponent(params.categoria); // Decodifica la categoría
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    const filteredProducts = products.filter(
    (product: any) => product.category === categoria
    );


    return (
    <>
        <div className="bg-[#cacdca]">
            <h1>Categorías</h1>
                <ul>
                    <li><Link href="/categorias/men's clothing">Men's Clothing</Link></li>
                    <li><Link href="/categorias/jewelery">Jewelery</Link></li>
                    <li><Link href="/categorias/electronics">Electronics</Link></li>
                    <li><Link href="/categorias/women's clothing">Women's Clothing</Link></li>
                </ul>
        </div>
        
        
        <div>
        <div className='flex flex-wrap justify-between bg-[#cacdca]'>
            {filteredProducts.map((product: any) => (
            <ProductCard
                key={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
            />
            ))}
        </div>
        </div>
        </>
    );
}    