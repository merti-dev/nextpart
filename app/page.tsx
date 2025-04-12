// app/page.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Product = {
  id: number;
  title: string;
  price: number;
  category: {
    name: string;
  };
  images: string[];
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://api.escuelajs.co/api/v1/products", {
    next: { revalidate: 3600 }, // optional caching
  });
  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();

  const categories = ["All", "Clothes", "Electronics", "Furniture", "Toys", "Books", "Sports"];

  return (
    <div>
      <div className="flex flex-wrap justify-center px-4 py-6 bg-gray-50">
        {categories.map((category, idx) => (
          <span
            key={idx}
            className="rounded-full border border-gray-300 bg-white text-gray-800 text-base font-medium mx-2 my-2 px-5 py-2 shadow-sm hover:shadow-md transition-transform transform hover:scale-105 cursor-pointer"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-20 pb-12">
        {products.map((product) => (
          <Card
            key={product.id}
            className="w-full max-w-xs mx-auto flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
          >
            <CardHeader className="bg-orange-50 py-4">
              <CardTitle className="text-xl text-orange-800 font-semibold">
                {product.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex justify-center items-center h-48 bg-white overflow-hidden flex-grow">
              {product.images?.[0] && (
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="object-contain max-h-full"
                />
              )}
            </CardContent>

            <CardFooter className="flex justify-between items-center px-4 py-2 text-sm text-gray-600">
              <span>
                Category: <strong>{product.category.name}</strong>
              </span>
              <span className="text-green-600 font-bold">${product.price}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
