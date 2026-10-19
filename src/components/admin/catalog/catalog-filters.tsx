"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { getAdminProductCategories } from "@/lib/data/admin-products";

export function CatalogFilters({ categories }: { categories: Awaited<ReturnType<typeof getAdminProductCategories>> }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParam("q", search);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <form onSubmit={submitSearch} className="flex gap-2">
          <div className="relative">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or SKU..."
              className="w-56 pl-8"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
        </form>

        <Select value={searchParams.get("category") ?? "all"} onValueChange={(v) => setParam("category", v)}>
          <SelectTrigger className="w-40" size="sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={searchParams.get("status") ?? "all"} onValueChange={(v) => setParam("status", v)}>
          <SelectTrigger className="w-32" size="sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={searchParams.get("stock") ?? "all"} onValueChange={(v) => setParam("stock", v)}>
          <SelectTrigger className="w-36" size="sm">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={`${searchParams.get("sort") ?? "name"}:${searchParams.get("dir") ?? "asc"}`}
          onValueChange={(v) => {
            const [sort, dir] = v.split(":");
            const params = new URLSearchParams(searchParams.toString());
            params.set("sort", sort);
            params.set("dir", dir);
            params.delete("page");
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
          }}
        >
          <SelectTrigger className="w-44" size="sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name:asc">Name (A–Z)</SelectItem>
            <SelectItem value="name:desc">Name (Z–A)</SelectItem>
            <SelectItem value="price:asc">Price (Low–High)</SelectItem>
            <SelectItem value="price:desc">Price (High–Low)</SelectItem>
            <SelectItem value="stock:asc">Stock (Low–High)</SelectItem>
            <SelectItem value="stock:desc">Stock (High–Low)</SelectItem>
            <SelectItem value="created_at:desc">Newest First</SelectItem>
            <SelectItem value="created_at:asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
