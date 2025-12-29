import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import type { Brand, InsertBrand } from "@shared/schema";

export default function BrandManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const { toast } = useToast();

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ["/api/brands"],
  });

  const createBrandMutation = useMutation({
    mutationFn: async (brand: InsertBrand) => {
      const response = await apiRequest("POST", "/api/brands", brand);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Brand created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create brand",
        variant: "destructive",
      });
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: async ({ id, ...brand }: Partial<Brand> & { id: string }) => {
      const response = await apiRequest("PUT", `/api/brands/${id}`, brand);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setEditingBrand(null);
      toast({
        title: "Success",
        description: "Brand updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update brand",
        variant: "destructive",
      });
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/brands/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({
        title: "Success",
        description: "Brand deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete brand",
        variant: "destructive",
      });
    },
  });

  const handleCreateBrand = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const brand: InsertBrand = {
      name: formData.get("name") as string,
      slug: (formData.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      icon: formData.get("icon") as string,
      primaryColor: formData.get("primaryColor") as string,
      description: formData.get("description") as string,
      status: "active",
    };
    createBrandMutation.mutate(brand);
  };

  const handleUpdateBrand = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBrand) return;

    const formData = new FormData(e.currentTarget);
    const updatedBrand = {
      id: editingBrand.id,
      name: formData.get("name") as string,
      slug: (formData.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      icon: formData.get("icon") as string,
      primaryColor: formData.get("primaryColor") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
    };
    updateBrandMutation.mutate(updatedBrand);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Brand Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your portfolio of brands and their configurations
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Brand
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Brand</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateBrand} className="space-y-4">
                <div>
                  <Label htmlFor="name">Brand Name</Label>
                  <Input id="name" name="name" placeholder="e.g., Seedwave™" required />
                </div>
                <div>
                  <Label htmlFor="icon">Icon/Emoji</Label>
                  <Input id="icon" name="icon" placeholder="🌱" required />
                </div>
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input id="primaryColor" name="primaryColor" type="color" defaultValue="#0071e3" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Brief description of the brand"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createBrandMutation.isPending}
                >
                  {createBrandMutation.isPending ? "Creating..." : "Create Brand"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand: Brand) => (
            <Card key={brand.id} className="brand-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {brand.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{brand.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{brand.slug}</p>
                    </div>
                  </div>
                  <Badge variant={brand.status === "active" ? "default" : "secondary"}>
                    {brand.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {brand.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {brand.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>Created: {new Date(brand.createdAt).toLocaleDateString()}</span>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: brand.primaryColor }}
                  ></div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingBrand(brand)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteBrandMutation.mutate(brand.id)}
                    disabled={deleteBrandMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {brands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No brands found</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Brand
            </Button>
          </div>
        )}

        {/* Edit Brand Dialog */}
        <Dialog open={!!editingBrand} onOpenChange={() => setEditingBrand(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Brand</DialogTitle>
            </DialogHeader>
            {editingBrand && (
              <form onSubmit={handleUpdateBrand} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Brand Name</Label>
                  <Input 
                    id="edit-name" 
                    name="name" 
                    defaultValue={editingBrand.name}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-icon">Icon/Emoji</Label>
                  <Input 
                    id="edit-icon" 
                    name="icon" 
                    defaultValue={editingBrand.icon}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-primaryColor">Primary Color</Label>
                  <Input 
                    id="edit-primaryColor" 
                    name="primaryColor" 
                    type="color" 
                    defaultValue={editingBrand.primaryColor}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    name="description" 
                    defaultValue={editingBrand.description || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <select 
                    id="edit-status" 
                    name="status" 
                    defaultValue={editingBrand.status}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={updateBrandMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateBrandMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
