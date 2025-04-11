"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Product = {
  id: number;
  title: string;
  price: number;
  category: {
    name: string;
  };
  image: string;
};

export default function ProductList({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [offset, setOffset] = useState(initialProducts.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setOffset((prev) => prev + 12);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  useEffect(() => {
    if (offset === initialProducts.length) return;
    const fetchMore = async () => {
      setLoading(true);
      const res = await fetch(
        `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=12`
      );
      const newData: Product[] = await res.json();
      setProducts((prev) => [...prev, ...newData]);
      setHasMore(newData.length === 12);
      setLoading(false);
    };
    fetchMore();
  }, [offset]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-contain max-h-full"
                />
              )}
            </CardContent>

            <CardFooter className="flex justify-between items-center px-4 py-2 text-sm text-gray-600">
              <span>
                Category: <strong>{product.category.name}</strong>
              </span>
              <span className="text-green-600 font-bold">
                ${product.price}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div ref={observerRef} className="text-center text-sm text-gray-500 py-6">
        {loading ? "Loading more..." : !hasMore && "No more products"}
      </div>
    </>
  );
}
