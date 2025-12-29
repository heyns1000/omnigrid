import { 
  users, brands, sectors, templates, brandSectorMappings, templateDeployments, analytics, secureSignDocuments,
  type User, type InsertUser, type Brand, type InsertBrand, type Sector, type InsertSector, 
  type Template, type InsertTemplate, type BrandSectorMapping, type InsertBrandSectorMapping,
  type TemplateDeployment, type InsertTemplateDeployment, type Analytics, type InsertAnalytics,
  type SecureSignDocument, type InsertSecureSignDocument
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Brand methods
  getAllBrands(): Promise<Brand[]>;
  getBrand(id: string): Promise<Brand | undefined>;
  createBrand(insertBrand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand>;
  deleteBrand(id: string): Promise<void>;
  
  // Sector methods
  getAllSectors(): Promise<Sector[]>;
  createSector(insertSector: InsertSector): Promise<Sector>;
  
  // Template methods
  getAllTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(insertTemplate: InsertTemplate): Promise<Template>;
  
  // Brand-Sector mapping methods
  getAllBrandSectorMappings(): Promise<BrandSectorMapping[]>;
  createBrandSectorMapping(insertMapping: InsertBrandSectorMapping): Promise<BrandSectorMapping>;
  
  // Deployment methods
  getAllDeployments(): Promise<TemplateDeployment[]>;
  createDeployment(insertDeployment: InsertTemplateDeployment): Promise<TemplateDeployment>;
  deployTemplate(templateId: string, brandId: string, sectorId: string): Promise<TemplateDeployment>;
  
  // Analytics methods
  getAnalytics(brandId?: string, sectorId?: string): Promise<Analytics[]>;
  createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics>;
  
  // SecureSign methods
  getAllSecureSignDocuments(): Promise<SecureSignDocument[]>;
  getSecureSignDocument(id: string): Promise<SecureSignDocument | undefined>;
  createSecureSignDocument(insertDocument: InsertSecureSignDocument): Promise<SecureSignDocument>;
  updateSecureSignDocument(id: string, updates: Partial<InsertSecureSignDocument>): Promise<SecureSignDocument>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Brand methods
  async getAllBrands(): Promise<Brand[]> {
    return await db.select().from(brands);
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id));
    return brand || undefined;
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const [brand] = await db.insert(brands).values(insertBrand).returning();
    return brand;
  }

  async updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand> {
    const [brand] = await db.update(brands).set(updates).where(eq(brands.id, id)).returning();
    return brand;
  }

  async deleteBrand(id: string): Promise<void> {
    await db.delete(brands).where(eq(brands.id, id));
  }

  // Sector methods
  async getAllSectors(): Promise<Sector[]> {
    return await db.select().from(sectors);
  }

  async createSector(insertSector: InsertSector): Promise<Sector> {
    const [sector] = await db.insert(sectors).values(insertSector).returning();
    return sector;
  }

  // Template methods
  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await db.insert(templates).values(insertTemplate).returning();
    return template;
  }

  // Brand-Sector mapping methods
  async getAllBrandSectorMappings(): Promise<BrandSectorMapping[]> {
    return await db.select().from(brandSectorMappings);
  }

  async createBrandSectorMapping(insertMapping: InsertBrandSectorMapping): Promise<BrandSectorMapping> {
    const [mapping] = await db.insert(brandSectorMappings).values(insertMapping).returning();
    return mapping;
  }

  // Deployment methods
  async getAllDeployments(): Promise<TemplateDeployment[]> {
    return await db.select().from(templateDeployments);
  }

  async createDeployment(insertDeployment: InsertTemplateDeployment): Promise<TemplateDeployment> {
    const [deployment] = await db.insert(templateDeployments).values(insertDeployment).returning();
    return deployment;
  }

  async deployTemplate(templateId: string, brandId: string, sectorId: string): Promise<TemplateDeployment> {
    const insertDeployment: InsertTemplateDeployment = {
      templateId,
      brandId,
      sectorId,
      deploymentStatus: "deployed",
      deployedAt: new Date(),
    };
    return await this.createDeployment(insertDeployment);
  }

  // Analytics methods
  async getAnalytics(brandId?: string, sectorId?: string): Promise<Analytics[]> {
    let query = db.select().from(analytics);
    if (brandId) query = query.where(eq(analytics.brandId, brandId));
    if (sectorId) query = query.where(eq(analytics.sectorId, sectorId));
    return await query;
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const [analytic] = await db.insert(analytics).values(insertAnalytics).returning();
    return analytic;
  }

  // SecureSign methods
  async getAllSecureSignDocuments(): Promise<SecureSignDocument[]> {
    return await db.select().from(secureSignDocuments);
  }

  async getSecureSignDocument(id: string): Promise<SecureSignDocument | undefined> {
    const [document] = await db.select().from(secureSignDocuments).where(eq(secureSignDocuments.id, id));
    return document || undefined;
  }

  async createSecureSignDocument(insertDocument: InsertSecureSignDocument): Promise<SecureSignDocument> {
    const [document] = await db.insert(secureSignDocuments).values(insertDocument).returning();
    return document;
  }

  async updateSecureSignDocument(id: string, updates: Partial<InsertSecureSignDocument>): Promise<SecureSignDocument> {
    const [document] = await db.update(secureSignDocuments).set(updates).where(eq(secureSignDocuments.id, id)).returning();
    return document;
  }
}

export const storage = new DatabaseStorage();