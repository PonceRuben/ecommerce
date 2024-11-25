'use client'
import ProductCard from '../components/ProductCard'
import { useEffect, useState } from 'react';
import Link from 'next/link';

// export default function Home() {
  
//   return ( 
//     <>
//       <div className='flex justify-between bg-[#ccc9aa]'>
//         <ProductCard image='remera-negra.jpg' title='Remera negra' price= {5000}  description='Una remera increiblemente negra'/>

//         <ProductCard image='remera-fucsia.jpg' title='Remera fucia' price= {4500}  description='Una remera increiblemente fucsia'/>

//         <ProductCard image='zapatillas-negras.jpeg' title='Zapatillas negras' price= {78000}  description='Un par de zapas que sale lo mismo que un corsa'/>
//     </div>
//     </>
// );
// }


interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch ('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);
  return ( 
    <>
      <div className='flex flex-wrap justify-between bg-[#cacdca]'>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
            />
        ))} 
      </div>
    </>
);
}


