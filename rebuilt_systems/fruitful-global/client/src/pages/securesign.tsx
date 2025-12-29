import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, FileText, Shield, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Brand, Sector, SecureSignDocument } from "@shared/schema";

const secureSignSchema = z.object({
  brandId: z.string().min(1, "Brand selection is required"),
  sectorId: z.string().min(1, "Sector selection is required"),
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  idType: z.enum(["national_id", "passport"], {
    required_error: "ID type is required",
  }),
  idNumber: z.string().min(1, "ID number is required"),
  nationality: z.string().min(1, "Nationality is required"),
  email: z.string().email("Valid email is required"),
  cellNumber: z.string().min(1, "Cell number is required"),
  employment: z.string().min(1, "Employment is required"),
  position: z.string().min(1, "Position is required"),
  selectedSectors: z.array(z.string()).min(1, "At least one sector must be selected").max(5, "Maximum 5 sectors allowed"),
  metrics: z.string().min(10, "Please provide detailed metrics information"),
  urlsReferences: z.string().min(10, "Please provide relevant URLs or references"),
  documentUrls: z.object({
    ndaFile: z.string().optional(),
    ciproDocs: z.string().optional(),
    directorsId: z.string().optional(),
    vcat: z.string().optional(),
    comaspnytDocs: z.string().optional(),
  }),
  termsAgree: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

type SecureSignFormData = z.infer<typeof secureSignSchema>;

export default function SecureSignPage() {
  const { toast } = useToast();
  const [selectedSectorCount, setSelectedSectorCount] = useState(0);

  // Fetch brands and sectors
  const { data: brands = [], isLoading: brandsLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const { data: sectors = [], isLoading: sectorsLoading } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  });

  // Fetch SecureSign documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery<SecureSignDocument[]>({
    queryKey: ["/api/securesign/documents"],
  });

  const form = useForm<SecureSignFormData>({
    resolver: zodResolver(secureSignSchema),
    defaultValues: {
      brandId: "",
      sectorId: "",
      firstName: "",
      surname: "",
      idType: "national_id",
      idNumber: "",
      nationality: "",
      email: "",
      cellNumber: "",
      employment: "",
      position: "",
      selectedSectors: [],
      metrics: "",
      urlsReferences: "",
      documentUrls: {},
      termsAgree: false,
    },
  });

  const createDocumentMutation = useMutation({
    mutationFn: (data: SecureSignFormData) =>
      apiRequest("/api/securesign/documents", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "SecureSign™ Document Submitted",
        description: "Your NDA application has been successfully submitted for processing.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/securesign/documents"] });
    },
    onError: () => {
      toast({
        title: "Submission Error",
        description: "Failed to submit SecureSign™ document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SecureSignFormData) => {
    createDocumentMutation.mutate(data);
  };

  const handleSectorSelection = (sectorId: string, checked: boolean) => {
    const currentSectors = form.getValues("selectedSectors");
    if (checked) {
      if (currentSectors.length >= 5) {
        toast({
          title: "Maximum Sectors Reached",
          description: "You can only select up to 5 sectors.",
          variant: "destructive",
        });
        return;
      }
      form.setValue("selectedSectors", [...currentSectors, sectorId]);
      setSelectedSectorCount(currentSectors.length + 1);
    } else {
      form.setValue("selectedSectors", currentSectors.filter(id => id !== sectorId));
      setSelectedSectorCount(currentSectors.length - 1);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" />Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="flex items-center gap-1 bg-green-600"><CheckCircle className="w-3 h-3" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (brandsLoading || sectorsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold">
            Fruitful Global | <span className="text-amber-600">SecureSign™</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Smart Legal Signature Engine for Fruitful Global™ - Core product available across all brands and subnodes
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                FAA™ NDA Submission Portal
              </CardTitle>
              <CardDescription>
                Submit your comprehensive NDA application under FAA™'s Atom-Level Verification™ Protocol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Brand and Sector Selection */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Brand</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sectorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Sector</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose sector" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sectors.map((sector) => (
                                <SelectItem key={sector.id} value={sector.id}>
                                  {sector.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-600">Personal Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name(s)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="surname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Surname</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your surname" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Identification Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-600">Identification Details</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="idType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="national_id">National ID</SelectItem>
                                <SelectItem value="passport">Passport</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="idNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter nationality" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-600">Contact Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cellNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cell Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your cell number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-600">Employment Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="employment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employer/Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter employer name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position/Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your position" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Sector Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-amber-600">Relevant Sectors</h3>
                      <Badge variant="outline" className="text-xs">
                        {selectedSectorCount}/5 selected
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select up to 5 sectors that are most relevant to your activities
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {sectors.map((sector) => (
                        <div key={sector.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={sector.id}
                            checked={form.getValues("selectedSectors").includes(sector.id)}
                            onCheckedChange={(checked) => 
                              handleSectorSelection(sector.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={sector.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {sector.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage>{form.formState.errors.selectedSectors?.message}</FormMessage>
                  </div>

                  {/* Metrics & References */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-600">Metrics & References</h3>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="metrics"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Metrics You've Worked With</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g., Conversion Rate, User Engagement, ROI, Throughput, Efficiency Gains, Specific KPIs..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Please describe relevant metrics and your experience with them
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="urlsReferences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relevant URLs / Online References</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g., GitHub repositories, LinkedIn profiles, portfolio websites, project URLs, academic papers, online articles..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Provide links to your work, profiles, or any other relevant online references
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <FormField
                    control={form.control}
                    name="termsAgree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            I agree to the FAA™ legal terms and Inline Verification™ protocols, 
                            acknowledging that all provided information is accurate and authentic.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createDocumentMutation.isPending}
                  >
                    {createDocumentMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Comprehensive NDA Application"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Document Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SecureSign™ Status</CardTitle>
              <CardDescription>
                Track your NDA applications across all brands
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : documents.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No SecureSign™ documents submitted yet
                </p>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{doc.firstName} {doc.surname}</p>
                        {getStatusBadge(doc.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {doc.employment} • {doc.position}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(doc.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Keys Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SecureSign™ Integration</CardTitle>
              <CardDescription>
                Available across all Fruitful Global™ brands
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p className="font-medium">✓ Seedwave™ Analytics Hub</p>
                <p className="font-medium">✓ VaultMesh™ Checkout Systems</p>
                <p className="font-medium">✓ Banimal™ Interactive Features</p>
                <p className="font-medium">✓ Fruitful Global™ Core Platform</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  SecureSign™ is deployed as a core product across all 29+ sectors 
                  with full brand and subnode integration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}