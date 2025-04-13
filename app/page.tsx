import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
const PAGE_SIZE = 8;
async function getNextPageCount(categoryId: number | undefined, page: number): Promise<number> {
  const nextPage = page + 1;
  const offset = (nextPage - 1) * PAGE_SIZE;

  let url = `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${PAGE_SIZE}`;
  if (categoryId) {
    url = `https://api.escuelajs.co/api/v1/products?categoryId=${categoryId}&offset=${offset}&limit=${PAGE_SIZE}`;
  }

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return 0; 
  const data: Product[] = await res.json();
  return data.length;
}


async function getCategoryCount(categoryId: number): Promise<number> {
  const url = `https://api.escuelajs.co/api/v1/products?categoryId=${categoryId}&offset=0&limit=1`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return 0;
  const data: Product[] = await res.json();
  return data.length;
}

async function getCategoriesWithProducts(): Promise<Category[]> {
  const res = await fetch("https://api.escuelajs.co/api/v1/categories", { cache: "no-store" });
  if (!res.ok) notFound();

  const cats: Category[] = await res.json();
  const results = await Promise.all(
    cats.map(async (cat) => {
      const count = await getCategoryCount(cat.id);
      return { cat, count };
    })
  );
  return results
    .filter((r) => r.count > 0)
    .map((r) => r.cat);
}

async function getProducts(categoryId?: number, page = 1): Promise<Product[]> {
  const offset = (page - 1) * PAGE_SIZE;
  let url = `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${PAGE_SIZE}`;

  if (categoryId) {
    url = `https://api.escuelajs.co/api/v1/products?categoryId=${categoryId}&offset=${offset}&limit=${PAGE_SIZE}`;
  }
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) notFound();

  return res.json();
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page: pageParam } = await searchParams;
  const categoryName = category || "All";
  const page = parseInt(pageParam || "1", 10);

  const realCats = await getCategoriesWithProducts();
  const categories = ["All", ...realCats.map((c) => c.name)];

  const selectedCat = realCats.find((cat) => cat.name === categoryName);
  const categoryId = selectedCat?.id;

  const products = await getProducts(categoryId, page);

  let hasNext = false;
  if (products.length === PAGE_SIZE) {
    const nextCount = await getNextPageCount(categoryId, page);
    hasNext = nextCount > 0;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-12">
      <div className="flex flex-wrap justify-center py-6 bg-gray-50">
        {categories.map((cat, i) => (
          <a
            key={i}
            href={`/?category=${encodeURIComponent(cat)}&page=1`}
            className={`rounded-full border border-gray-300 bg-white text-gray-800 text-base font-medium mx-2 my-2 px-5 py-2 
            shadow-sm hover:shadow-md transition-transform hover:scale-105 ${
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
            className="w-full max-w-xs mx-auto flex flex-col justify-between 
            shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
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

      {/* Pagination */}
      <div className="flex justify-center gap-4 pb-10">
        {/* previous */}
        {page > 1 && (
          <a
            href={`/?category=${encodeURIComponent(categoryName)}&page=${page - 1}`}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Previous
          </a>
        )}
        {hasNext && (
          <a
            href={`/?category=${encodeURIComponent(categoryName)}&page=${page + 1}`}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}
