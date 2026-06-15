import { useState } from "react";
import { useLocation } from "wouter";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Product } from "../../../../shared/schema";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { products, orders, createProduct, updateProduct, deleteProduct, uploadImage } = useAdmin();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [uploading, setUploading] = useState(false);

  if (products.error?.message === "Unauthorized") {
    navigate("/admin/login");
    return null;
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    setter(url);
    setUploading(false);
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => navigate("/")}>View Store</Button>
        </div>

        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products ({products.data?.length ?? 0})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.data?.length ?? 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>+ Add Product</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={newProduct.name ?? ""} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input type="number" step="0.01" value={newProduct.price ?? ""} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Dimensions</Label>
                      <Input value={newProduct.dimensions ?? ""} onChange={e => setNewProduct({...newProduct, dimensions: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight</Label>
                      <Input value={newProduct.weight ?? ""} onChange={e => setNewProduct({...newProduct, weight: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Product Image</Label>
                      <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNewProduct({...newProduct, imageUrl: url}))} />
                      {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                      {newProduct.imageUrl && <img src={newProduct.imageUrl} className="w-24 h-24 object-cover rounded" />}
                    </div>
                    <Button className="w-full" onClick={() => {
                      createProduct.mutate({
                        ...newProduct,
                        slug: newProduct.name?.toLowerCase().replace(/\s+/g, "-") ?? "",
                        scents: ["Jasmine","Vanilla","Rain Water","Fresh Linen","Star Gazer Lily","Cherry Blossom","Honeysuckle","Zippity Do Dah"],
                        colors: ["White","Yellow","Blue","Red","Purple","Orange","Pink","Aquamarine","Bright Green"],
                        inStock: true,
                      });
                    }}>
                      Save Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.data?.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <Badge variant={product.inStock ? "default" : "secondary"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteProduct.mutate(product.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="orders">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data?.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      <div>{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                    </TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                    <TableCell><Badge>{order.status}</Badge></TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
