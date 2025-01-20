interface ProductCardProps {
  image: string;
  title: string;
  price: number;
}

export default function ProductCard({ image, title, price }: ProductCardProps) {
  return (
    <div className="rounded-[25px] bg-[#02242d] p-6 w-full max-w-[350px] h-auto shadow-lg hover:shadow-2xl transition-shadow duration-300 my-8">
      {/* Product Image */}
      <div className="w-full h-[250px] overflow-hidden rounded-[20px] border-2 border-[#03424a] shadow-md">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Card Content */}
      <div className="mt-6 flex flex-col items-center text-center">
        {/* Product Title */}
        <h2 className="text-white font-semibold text-lg sm:text-xl lg:text-2xl leading-tight">
          {title}
        </h2>

        {/* Product Price */}
        <div className="mt-4 text-xl font-bold text-white sm:text-2xl lg:text-3xl">
          <span>${price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
