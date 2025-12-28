import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  primaryColor: text("primary_color").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sectors = pgTable("sectors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  ciColor: text("ci_color").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'header', 'footer', 'checkout', 'payment', 'dashboard', 'interactive'
  version: text("version").notNull(),
  content: jsonb("content").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const brandSectorMappings = pgTable("brand_sector_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandId: varchar("brand_id").notNull().references(() => brands.id),
  sectorId: varchar("sector_id").notNull().references(() => sectors.id),
  customization: jsonb("customization"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const templateDeployments = pgTable("template_deployments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull().references(() => templates.id),
  brandId: varchar("brand_id").notNull().references(() => brands.id),
  sectorId: varchar("sector_id").notNull().references(() => sectors.id),
  deploymentStatus: text("deployment_status").notNull().default("pending"),
  deployedAt: timestamp("deployed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandId: varchar("brand_id").notNull().references(() => brands.id),
  sectorId: varchar("sector_id").notNull().references(() => sectors.id),
  metric: text("metric").notNull(),
  value: integer("value").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const secureSignDocuments = pgTable("secure_sign_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandId: varchar("brand_id").notNull().references(() => brands.id),
  sectorId: varchar("sector_id").notNull().references(() => sectors.id),
  firstName: text("first_name").notNull(),
  surname: text("surname").notNull(),
  idType: text("id_type").notNull(),
  idNumber: text("id_number").notNull(),
  nationality: text("nationality").notNull(),
  email: text("email").notNull(),
  cellNumber: text("cell_number").notNull(),
  employment: text("employment").notNull(),
  position: text("position").notNull(),
  selectedSectors: jsonb("selected_sectors").notNull(),
  metrics: text("metrics").notNull(),
  urlsReferences: text("urls_references").notNull(),
  documentUrls: jsonb("document_urls").notNull(),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Relations
export const brandsRelations = relations(brands, ({ many }) => ({
  sectorMappings: many(brandSectorMappings),
  deployments: many(templateDeployments),
  analytics: many(analytics),
}));

export const sectorsRelations = relations(sectors, ({ many }) => ({
  brandMappings: many(brandSectorMappings),
  deployments: many(templateDeployments),
  analytics: many(analytics),
}));

export const templatesRelations = relations(templates, ({ many }) => ({
  deployments: many(templateDeployments),
}));

export const brandSectorMappingsRelations = relations(brandSectorMappings, ({ one }) => ({
  brand: one(brands, {
    fields: [brandSectorMappings.brandId],
    references: [brands.id],
  }),
  sector: one(sectors, {
    fields: [brandSectorMappings.sectorId],
    references: [sectors.id],
  }),
}));

export const templateDeploymentsRelations = relations(templateDeployments, ({ one }) => ({
  template: one(templates, {
    fields: [templateDeployments.templateId],
    references: [templates.id],
  }),
  brand: one(brands, {
    fields: [templateDeployments.brandId],
    references: [brands.id],
  }),
  sector: one(sectors, {
    fields: [templateDeployments.sectorId],
    references: [sectors.id],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  brand: one(brands, {
    fields: [analytics.brandId],
    references: [brands.id],
  }),
  sector: one(sectors, {
    fields: [analytics.sectorId],
    references: [sectors.id],
  }),
}));

export const secureSignDocumentsRelations = relations(secureSignDocuments, ({ one }) => ({
  brand: one(brands, {
    fields: [secureSignDocuments.brandId],
    references: [brands.id],
  }),
  sector: one(sectors, {
    fields: [secureSignDocuments.sectorId],
    references: [sectors.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSectorSchema = createInsertSchema(sectors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBrandSectorMappingSchema = createInsertSchema(brandSectorMappings).omit({
  id: true,
  createdAt: true,
});

export const insertTemplateDeploymentSchema = createInsertSchema(templateDeployments).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});

export const insertSecureSignDocumentSchema = createInsertSchema(secureSignDocuments).omit({
  id: true,
  submittedAt: true,
  processedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Sector = typeof sectors.$inferSelect;
export type InsertSector = z.infer<typeof insertSectorSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type BrandSectorMapping = typeof brandSectorMappings.$inferSelect;
export type InsertBrandSectorMapping = z.infer<typeof insertBrandSectorMappingSchema>;
export type TemplateDeployment = typeof templateDeployments.$inferSelect;
export type InsertTemplateDeployment = z.infer<typeof insertTemplateDeploymentSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type SecureSignDocument = typeof secureSignDocuments.$inferSelect;
export type InsertSecureSignDocument = z.infer<typeof insertSecureSignDocumentSchema>;
