import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ProductFiltersProps {
  onFiltersChange: (filters: ProductFilters) => void;
  categories: Array<{ id: number; name: string }>;
}

export interface ProductFilters {
  categoryIds: number[];
  priceRange: [number, number];
  featured: boolean;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'rating' | 'popular';
}

export function ProductFilters({ onFiltersChange, categories }: ProductFiltersProps) {
  const [filters, setFilters] = useState<ProductFilters>({
    categoryIds: [],
    priceRange: [0, 100],
    featured: false,
    sortBy: 'newest',
  });

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const defaultFilters: ProductFilters = {
      categoryIds: [],
      priceRange: [0, 100],
      featured: false,
      sortBy: 'newest',
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const activeFilterCount = 
    filters.categoryIds.length + 
    (filters.featured ? 1 : 0) + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {activeFilterCount > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{activeFilterCount} active</Badge>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sort By */}
        <div>
          <h3 className="font-medium mb-3">Sort By</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'popular', label: 'Popular' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Highest Rated' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={filters.sortBy === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters({ sortBy: option.value as any })}
                className="justify-start text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categoryIds.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters({
                        categoryIds: [...filters.categoryIds, category.id]
                      });
                    } else {
                      updateFilters({
                        categoryIds: filters.categoryIds.filter(id => id !== category.id)
                      });
                    }
                  }}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Special Filters */}
        <div>
          <h3 className="font-medium mb-3">Special</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.featured}
              onCheckedChange={(checked) => updateFilters({ featured: !!checked })}
            />
            <label htmlFor="featured" className="text-sm cursor-pointer">
              Featured Products Only
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
