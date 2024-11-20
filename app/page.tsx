import ProductCard from '../components/ProductCard'


export default function Home() {
  return ( 
    <>
      <div className='flex justify-between bg-[#ccc9aa]'>
        <ProductCard image='remera-negra.jpg' title='Remera negra' price= {5000}  description='Una remera increiblemente negra'/>

        <ProductCard image='remera-fucsia.jpg' title='Remera fucia' price= {4500}  description='Una remera increiblemente fucsia'/>

        <ProductCard image='zapatillas-negras.jpeg' title='Zapatillas negras' price= {78000}  description='Un par de zapas que sale lo mismo que un corsa'/>
    </div>
    </>
);
}
