import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, X, Search } from "lucide-react";

interface Filters {
  category: string;
  scent: string;
  search: string;
  sortBy: 'price' | 'rating' | 'name' | 'newest';
  sortOrder: 'asc' | 'desc';
}

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const categories = [
  'Aromatherapy',
  'Seasonal',
  'Luxury',
  'Soy Wax',
  'Beeswax',
  'Pillar',
  'Votive',
  'Tea Light'
];

const scents = [
  'Vanilla',
  'Lavender',
  'Citrus',
  'Sandalwood',
  'Rose',
  'Eucalyptus',
  'Cedar',
  'Jasmine',
  'Peppermint',
  'Ocean Breeze',
  'Pine',
  'Cinnamon'
];

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState({
    category: true,
    scent: true,
    sort: true,
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      scent: '',
      search: '',
      sortBy: 'newest',
      sortOrder: 'desc',
    });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const activeFiltersCount = [
    filters.category,
    filters.scent,
    filters.search,
  ].filter(Boolean).length;

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {activeFiltersCount} active
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search candles..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Separator />

        {/* Sort */}
        <Collapsible
          open={openSections.sort}
          onOpenChange={() => toggleSection('sort')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Sort By</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections.sort ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-') as [Filters['sortBy'], Filters['sortOrder']];
                onFiltersChange({
                  ...filters,
                  sortBy,
                  sortOrder,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest-desc">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Category Filter */}
        <Collapsible
          open={openSections.category}
          onOpenChange={() => toggleSection('category')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Category</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections.category ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            <div className="grid grid-cols-1 gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filters.category === category ? "default" : "outline"}
                  size="sm"
                  className="justify-start h-9"
                  onClick={() => handleFilterChange('category', filters.category === category ? '' : category)}
                >
                  {category}
                  {filters.category === category && (
                    <X className="w-3 h-3 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Scent Filter */}
        <Collapsible
          open={openSections.scent}
          onOpenChange={() => toggleSection('scent')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Scent</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections.scent ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            <div className="grid grid-cols-1 gap-2">
              {scents.map((scent) => (
                <Button
                  key={scent}
                  variant={filters.scent === scent ? "default" : "outline"}
                  size="sm"
                  className="justify-start h-9"
                  onClick={() => handleFilterChange('scent', filters.scent === scent ? '' : scent)}
                >
                  {scent}
                  {filters.scent === scent && (
                    <X className="w-3 h-3 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
