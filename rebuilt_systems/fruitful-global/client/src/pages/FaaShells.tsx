import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, Edit, Trash2, Zap, FileText } from "lucide-react";
import { insertFaaPlaceholderShellSchema, type FaaPlaceholderShell, type InsertFaaPlaceholderShell } from "@shared/schema";
import { z } from "zod";

interface Brand {
  id: string;
  name: string;
  slug: string;
  icon: string;
  primaryColor: string;
  description: string;
}

interface Sector {
  id: string;
  name: string;
  slug: string;
  icon: string;
  ciColor: string;
  description: string;
}

const faaShellFormSchema = insertFaaPlaceholderShellSchema.extend({
  metadata: z.record(z.any()).optional()
});

export default function FaaShells() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedShell, setSelectedShell] = useState<FaaPlaceholderShell | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: shells, isLoading: shellsLoading } = useQuery<FaaPlaceholderShell[]>({
    queryKey: ["/api/faa-shells"],
  });

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const { data: sectors } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  });

  const createShellMutation = useMutation({
    mutationFn: async (data: InsertFaaPlaceholderShell) => {
      const response = await fetch("/api/faa-shells", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create shell");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faa-shells"] });
      setIsCreateDialogOpen(false);
      toast({ title: "Success", description: "FAA Placeholder Shell created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create shell", variant: "destructive" });
    },
  });

  const updateShellMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertFaaPlaceholderShell> }) => {
      const response = await fetch(`/api/faa-shells/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update shell");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faa-shells"] });
      setIsEditDialogOpen(false);
      toast({ title: "Success", description: "Shell updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update shell", variant: "destructive" });
    },
  });

  const activateApendanceMutation = useMutation({
    mutationFn: async ({ id, sectorId, brandId }: { id: string; sectorId: string; brandId: string }) => {
      const response = await fetch(`/api/faa-shells/${id}/activate-apendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectorId, brandId }),
      });
      if (!response.ok) throw new Error("Failed to activate Sector Apendance");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faa-shells"] });
      toast({ title: "Success", description: "Sector Apendance activated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to activate Sector Apendance", variant: "destructive" });
    },
  });

  const deleteShellMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/faa-shells/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete shell");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faa-shells"] });
      toast({ title: "Success", description: "Shell deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete shell", variant: "destructive" });
    },
  });

  const generateDocumentSpineId = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `FAA-PLH-SHL-${date}-${random}`;
  };

  const createForm = useForm<z.infer<typeof faaShellFormSchema>>({
    resolver: zodResolver(faaShellFormSchema),
    defaultValues: {
      documentSpineId: generateDocumentSpineId(),
      stage: "Pre-Sector Apendance",
      custodian: "Heyns Schoeman ™",
      ecosystem: "BANIMAL LOOP™ · Fruitful Global™ · Baobab™",
      royaltyChannels: "Dormant state",
      verificationStatus: "FAA Inline Verification™ available but optional at shell stage",
      expansionVector: "Stored in vault mesh for later sector-heat grafting",
      status: "placeholder",
    },
  });

  const editForm = useForm<z.infer<typeof faaShellFormSchema>>({
    resolver: zodResolver(faaShellFormSchema),
  });

  useEffect(() => {
    if (selectedShell && isEditDialogOpen) {
      editForm.reset({
        documentSpineId: selectedShell.documentSpineId,
        stage: selectedShell.stage,
        custodian: selectedShell.custodian,
        ecosystem: selectedShell.ecosystem,
        seedOrigin: selectedShell.seedOrigin || undefined,
        sectorAnchor: selectedShell.sectorAnchor || undefined,
        royaltyChannels: selectedShell.royaltyChannels || undefined,
        verificationStatus: selectedShell.verificationStatus || undefined,
        expansionVector: selectedShell.expansionVector || undefined,
        scrollNote: selectedShell.scrollNote || undefined,
        status: selectedShell.status,
        brandId: selectedShell.brandId || undefined,
        sectorId: selectedShell.sectorId || undefined,
      });
    }
  }, [selectedShell, isEditDialogOpen, editForm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placeholder": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "active": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200";
      case "grafted": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200";
      case "archived": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getBrandName = (brandId: string | null) => {
    if (!brandId) return "N/A";
    const brand = brands?.find(b => b.id === brandId);
    return brand ? `${brand.icon} ${brand.name}` : "Unknown Brand";
  };

  const getSectorName = (sectorId: string | null) => {
    if (!sectorId) return "N/A";
    const sector = sectors?.find(s => s.id === sectorId);
    return sector ? `${sector.icon} ${sector.name}` : "Unknown Sector";
  };

  const onCreateSubmit = (data: z.infer<typeof faaShellFormSchema>) => {
    createShellMutation.mutate(data);
  };

  const onEditSubmit = (data: z.infer<typeof faaShellFormSchema>) => {
    if (selectedShell) {
      updateShellMutation.mutate({ id: selectedShell.id, data });
    }
  };

  const handleActivateApendance = (shell: FaaPlaceholderShell, sectorId: string, brandId: string) => {
    activateApendanceMutation.mutate({ id: shell.id, sectorId, brandId });
  };

  if (shellsLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading FAA Placeholder Shells...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">🌀 FAA™ Placeholder Intake Shells</h1>
          <p className="text-muted-foreground">
            Document ecosystem management for BANIMAL LOOP™ · Fruitful Global™ · Baobab™
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-shell">
              <Plus className="h-4 w-4 mr-2" />
              Create Shell
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create FAA™ Placeholder Intake Shell</DialogTitle>
              <DialogDescription>
                Create a new placeholder shell for document ecosystem intake
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="documentSpineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Spine ID</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-document-spine-id" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="custodian"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custodian</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-custodian" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="ecosystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ecosystem</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-ecosystem" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="seedOrigin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seed Origin</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="To be appended" data-testid="input-seed-origin" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="scrollNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scroll Note</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value || ""} placeholder="Additional notes about the shell..." data-testid="input-scroll-note" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createShellMutation.isPending} data-testid="button-submit-create">
                    {createShellMutation.isPending ? "Creating..." : "Create Shell"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {shells && shells.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No FAA Placeholder Shells</h3>
              <p className="mb-4">Create your first intake shell to begin document ecosystem management</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first-shell">
                <Plus className="h-4 w-4 mr-2" />
                Create First Shell
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shells?.map((shell) => (
            <Card key={shell.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium truncate" data-testid={`text-spine-id-${shell.id}`}>
                      {shell.documentSpineId}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1" data-testid={`text-custodian-${shell.id}`}>
                      Custodian: {shell.custodian}
                    </p>
                  </div>
                  <Badge className={`ml-2 ${getStatusColor(shell.status)}`} data-testid={`badge-status-${shell.id}`}>
                    {shell.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium">Stage</Label>
                    <p className="text-sm" data-testid={`text-stage-${shell.id}`}>{shell.stage}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium">Ecosystem</Label>
                    <p className="text-xs text-muted-foreground" data-testid={`text-ecosystem-${shell.id}`}>{shell.ecosystem}</p>
                  </div>

                  {shell.brandId && (
                    <div>
                      <Label className="text-xs font-medium">Brand</Label>
                      <p className="text-sm" data-testid={`text-brand-${shell.id}`}>{getBrandName(shell.brandId)}</p>
                    </div>
                  )}

                  {shell.sectorId && (
                    <div>
                      <Label className="text-xs font-medium">Sector</Label>
                      <p className="text-sm" data-testid={`text-sector-${shell.id}`}>{getSectorName(shell.sectorId)}</p>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs font-medium">Royalty Channels</Label>
                    <p className="text-xs text-muted-foreground" data-testid={`text-royalty-${shell.id}`}>
                      {shell.royaltyChannels}
                    </p>
                  </div>

                  {shell.scrollNote && (
                    <div>
                      <Label className="text-xs font-medium">Scroll Note</Label>
                      <p className="text-xs text-muted-foreground truncate" data-testid={`text-scroll-note-${shell.id}`}>
                        {shell.scrollNote}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedShell(shell);
                        setIsViewDialogOpen(true);
                      }}
                      data-testid={`button-view-${shell.id}`}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedShell(shell);
                        setIsEditDialogOpen(true);
                      }}
                      data-testid={`button-edit-${shell.id}`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    {shell.status === "placeholder" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const defaultBrandId = brands?.[0]?.id;
                          const defaultSectorId = sectors?.[0]?.id;
                          if (defaultBrandId && defaultSectorId) {
                            handleActivateApendance(shell, defaultSectorId, defaultBrandId);
                          }
                        }}
                        data-testid={`button-activate-${shell.id}`}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Activate
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteShellMutation.mutate(shell.id)}
                      data-testid={`button-delete-${shell.id}`}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Shell Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>FAA™ Placeholder Intake Shell Details</DialogTitle>
            <DialogDescription>Complete shell information and metadata</DialogDescription>
          </DialogHeader>
          {selectedShell && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Document Spine ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedShell.documentSpineId}</p>
                </div>
                <div>
                  <Label className="font-medium">Stage</Label>
                  <p className="text-sm text-muted-foreground">{selectedShell.stage}</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedShell.status)}>{selectedShell.status}</Badge>
                </div>
                <div>
                  <Label className="font-medium">Custodian</Label>
                  <p className="text-sm text-muted-foreground">{selectedShell.custodian}</p>
                </div>
                <div>
                  <Label className="font-medium">Ecosystem</Label>
                  <p className="text-sm text-muted-foreground">{selectedShell.ecosystem}</p>
                </div>
                <div>
                  <Label className="font-medium">Brand</Label>
                  <p className="text-sm text-muted-foreground">{getBrandName(selectedShell.brandId)}</p>
                </div>
                <div>
                  <Label className="font-medium">Sector</Label>
                  <p className="text-sm text-muted-foreground">{getSectorName(selectedShell.sectorId)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Seed Origin</Label>
                  <p className="text-sm text-muted-foreground">{selectedShell.seedOrigin || "To be appended"}</p>
                </div>
                <div>
                  <Label className="font-medium">Sector Anchor</Label>
                  <p className="text-sm text-muted-foreground">{selectedShell.sectorAnchor || "Not yet applied"}</p>
                </div>
                <div>
                  <Label className="font-medium">Royalty Channels</Label>
                  <p className="text-sm text-muted-foreground">{selectedShell.royaltyChannels}</p>
                </div>
                <div>
                  <Label className="font-medium">Verification Status</Label>
                  <p className="text-sm text-muted-foreground">{selectedShell.verificationStatus}</p>
                </div>
                <div>
                  <Label className="font-medium">Expansion Vector</Label>
                  <p className="text-sm text-muted-foreground">{selectedShell.expansionVector}</p>
                </div>
                <div>
                  <Label className="font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedShell.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedShell.apendanceActivatedAt && (
                  <div>
                    <Label className="font-medium">Apendance Activated</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedShell.apendanceActivatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              {selectedShell.scrollNote && (
                <div className="col-span-2">
                  <Label className="font-medium">Scroll Note</Label>
                  <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded-md">
                    {selectedShell.scrollNote}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Shell Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit FAA™ Placeholder Shell</DialogTitle>
            <DialogDescription>Update shell information and metadata</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="documentSpineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Spine ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="placeholder">Placeholder</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="grafted">Grafted</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="seedOrigin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seed Origin</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="scrollNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scroll Note</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={updateShellMutation.isPending}>
                  {updateShellMutation.isPending ? "Updating..." : "Update Shell"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}