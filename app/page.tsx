import ProductList from "../components/ui/ProductList";
import { Badge } from "@/components/ui/badge";

type Product = {
  id: number;
  title: string;
  price: number;
  category: {
    name: string;
  };
  image: string;
};

export default async function Page() {
  const res = await fetch(
    "https://fakestoreapi.com/products?offset=0&limit=12",
    
    { cache: "no-store" }
  );
  console.log(res)
  const initialProducts: Product[] = await res.json();

  const categories = [
    "All",
    "Clothes",
    "Electronics",
    "Furniture",
    "Toys",
    "Books",
    "Sports",
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-center px-4 py-6 bg-gray-50">
        {categories.map((category, index) => (
          <Badge
            key={index}
            variant="outline"
            className="rounded-full border border-gray-300 bg-white text-gray-800 text-base font-medium mx-2 my-2 px-5 py-2 shadow-sm hover:shadow-md transition-transform transform hover:scale-105 hover:bg-white cursor-pointer"
          >
            {category}
          </Badge>
        ))}
      </div>

      <ProductList initialProducts={initialProducts} />
    </div>
  );
}
