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

export const consolidatedAnalytics = pgTable("consolidated_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dateRange: text("date_range").notNull(), // 'daily', 'weekly', 'monthly', 'yearly'
  period: text("period").notNull(), // '2025-01-28', '2025-W4', '2025-01', '2025'
  brandId: varchar("brand_id").references(() => brands.id), // null for cross-brand analytics
  sectorId: varchar("sector_id").references(() => sectors.id), // null for cross-sector analytics
  metrics: jsonb("metrics").notNull(), // comprehensive metrics object
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const brandPerformance = pgTable("brand_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandId: varchar("brand_id").notNull().references(() => brands.id),
  deploymentCount: integer("deployment_count").notNull().default(0),
  activeTemplates: integer("active_templates").notNull().default(0),
  sectorCoverage: integer("sector_coverage").notNull().default(0),
  conversionRate: integer("conversion_rate").notNull().default(0), // percentage * 100
  revenueGenerated: integer("revenue_generated").notNull().default(0), // in cents
  userEngagement: integer("user_engagement").notNull().default(0), // engagement score
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const sectorInsights = pgTable("sector_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectorId: varchar("sector_id").notNull().references(() => sectors.id),
  totalDeployments: integer("total_deployments").notNull().default(0),
  activeBrands: integer("active_brands").notNull().default(0),
  growthRate: integer("growth_rate").notNull().default(0), // percentage * 100
  marketPenetration: integer("market_penetration").notNull().default(0), // percentage * 100
  averagePerformance: integer("average_performance").notNull().default(0),
  competitiveIndex: integer("competitive_index").notNull().default(0),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const crossBrandAnalytics = pgTable("cross_brand_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metric: text("metric").notNull(),
  seedwaveValue: integer("seedwave_value").notNull().default(0),
  vaultmeshValue: integer("vaultmesh_value").notNull().default(0),
  banimalValue: integer("banimal_value").notNull().default(0),
  fruitfulValue: integer("fruitful_value").notNull().default(0),
  totalValue: integer("total_value").notNull().default(0),
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

export const faaPlaceholderShells = pgTable("faa_placeholder_shells", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentSpineId: text("document_spine_id").notNull().unique(),
  stage: text("stage").notNull().default("Pre-Sector Apendance"),
  custodian: text("custodian").notNull(),
  ecosystem: text("ecosystem").notNull(), // "BANIMAL LOOP™ · Fruitful Global™ · Baobab™"
  seedOrigin: text("seed_origin"),
  sectorAnchor: text("sector_anchor"),
  royaltyChannels: text("royalty_channels").default("Dormant state"),
  verificationStatus: text("verification_status").default("FAA Inline Verification™ available but optional at shell stage"),
  expansionVector: text("expansion_vector").default("Stored in vault mesh for later sector-heat grafting"),
  scrollNote: text("scroll_note"),
  status: text("status").notNull().default("placeholder"), // "placeholder", "active", "grafted", "archived"
  brandId: varchar("brand_id").references(() => brands.id),
  sectorId: varchar("sector_id").references(() => sectors.id),
  metadata: jsonb("metadata"), // Additional flexible data storage
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  apendanceActivatedAt: timestamp("apendance_activated_at"),
});

// Relations
export const brandsRelations = relations(brands, ({ many, one }) => ({
  sectorMappings: many(brandSectorMappings),
  deployments: many(templateDeployments),
  analytics: many(analytics),
  performance: one(brandPerformance),
}));

export const sectorsRelations = relations(sectors, ({ many, one }) => ({
  brandMappings: many(brandSectorMappings),
  deployments: many(templateDeployments),
  analytics: many(analytics),
  insights: one(sectorInsights),
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

export const faaPlaceholderShellsRelations = relations(faaPlaceholderShells, ({ one }) => ({
  brand: one(brands, {
    fields: [faaPlaceholderShells.brandId],
    references: [brands.id],
  }),
  sector: one(sectors, {
    fields: [faaPlaceholderShells.sectorId],
    references: [sectors.id],
  }),
}));

// Add new relations for analytics tables
export const brandPerformanceRelations = relations(brandPerformance, ({ one }) => ({
  brand: one(brands, {
    fields: [brandPerformance.brandId],
    references: [brands.id],
  }),
}));

export const sectorInsightsRelations = relations(sectorInsights, ({ one }) => ({
  sector: one(sectors, {
    fields: [sectorInsights.sectorId],
    references: [sectors.id],
  }),
}));

export const consolidatedAnalyticsRelations = relations(consolidatedAnalytics, ({ one }) => ({
  brand: one(brands, {
    fields: [consolidatedAnalytics.brandId],
    references: [brands.id],
  }),
  sector: one(sectors, {
    fields: [consolidatedAnalytics.sectorId],
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

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  timestamp: true,
});

export const insertConsolidatedAnalyticsSchema = createInsertSchema(consolidatedAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBrandPerformanceSchema = createInsertSchema(brandPerformance).omit({
  id: true,
  lastUpdated: true,
});

export const insertSectorInsightsSchema = createInsertSchema(sectorInsights).omit({
  id: true,
  lastUpdated: true,
});

export const insertCrossBrandAnalyticsSchema = createInsertSchema(crossBrandAnalytics).omit({
  id: true,
  timestamp: true,
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



export const insertSecureSignDocumentSchema = createInsertSchema(secureSignDocuments).omit({
  id: true,
  submittedAt: true,
  processedAt: true,
});

export const insertFaaPlaceholderShellSchema = createInsertSchema(faaPlaceholderShells).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  apendanceActivatedAt: true,
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
export type ConsolidatedAnalytics = typeof consolidatedAnalytics.$inferSelect;
export type InsertConsolidatedAnalytics = z.infer<typeof insertConsolidatedAnalyticsSchema>;
export type BrandPerformance = typeof brandPerformance.$inferSelect;
export type InsertBrandPerformance = z.infer<typeof insertBrandPerformanceSchema>;
export type SectorInsights = typeof sectorInsights.$inferSelect;
export type InsertSectorInsights = z.infer<typeof insertSectorInsightsSchema>;
export type CrossBrandAnalytics = typeof crossBrandAnalytics.$inferSelect;
export type InsertCrossBrandAnalytics = z.infer<typeof insertCrossBrandAnalyticsSchema>;
export type SecureSignDocument = typeof secureSignDocuments.$inferSelect;
export type InsertSecureSignDocument = z.infer<typeof insertSecureSignDocumentSchema>;
export type FaaPlaceholderShell = typeof faaPlaceholderShells.$inferSelect;
export type InsertFaaPlaceholderShell = z.infer<typeof insertFaaPlaceholderShellSchema>;
