interface ProductCardProps {
    image: string,
    title: string,
    price: number,
    description: string,
}


export default function ProductCard({ image, title, price, description }: ProductCardProps) {
    return(
        <div className='card bg-[#bfbfbf] p-20 w-96 h-[500px] m-10'>
            <img src={image} alt={title} className='card-image w-72 h-72 object-cover'/>
            <h2>{title}</h2>
            <p>{description}</p>
            <span>${price}</span>
        </div>
    )
}