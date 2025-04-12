import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

type Product = {
  id: number;
  title: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  images: string[];
};

type Category = {
  id: number;
  name: string;
};

async function getCategories(): Promise<Category[]> {
  const res = await fetch("https://api.escuelajs.co/api/v1/categories", {
    cache: "no-store",
  });
  if (!res.ok) notFound();
  return res.json();
}

async function getProducts(categoryId?: number): Promise<Product[]> {
  const url = categoryId
    ? `https://api.escuelajs.co/api/v1/products/?categoryId=${categoryId}`
    : `https://api.escuelajs.co/api/v1/products?offset=0&limit=12`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) notFound();
  return res.json();
}

export default async function Page({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categoryName = searchParams.category || "All";
  const categories = await getCategories();

  const selectedCategory = categories.find((cat) => cat.name === categoryName);
  const categoryId = selectedCategory?.id;

  const products = await getProducts(categoryId);

  return (
    <div className="px-4 sm:px-6 lg:px-12">
      <div className="flex flex-wrap justify-center py-6 bg-gray-50">
        {["All", ...categories.map((cat) => cat.name)].map((cat, i) => (
          <a
            key={i}
            href={`/?category=${encodeURIComponent(cat)}`}
            className={`rounded-full border border-gray-300 bg-white text-gray-800 text-base font-medium mx-2 my-2 px-5 py-2 shadow-sm hover:shadow-md transition-transform hover:scale-105 ${
              cat === categoryName ? "bg-gray-200" : ""
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-8 pb-12">
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
                  src={product.images[0]}
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
