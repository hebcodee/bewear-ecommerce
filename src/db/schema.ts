import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
});

export const categoryTable = pgTable("category", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  createAt: timestamp("create_at").notNull().defaultNow(),
});

export const categoryRelatios = relations(categoryTable, (params) => ({
  products: params.many(categoryTable),
}));

export const productTable = pgTable("product", {
  id: uuid().primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categoryTable.id),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  createAt: timestamp("create_at").notNull().defaultNow(),
});

export const productRelations = relations(productTable, (params) => {
  return {
    category: params.one(categoryTable, {
      fields: [productTable.categoryId],
      references: [categoryTable.id],
    }),
    variants: params.many(productVariantTable),
  };
});

export const productVariantTable = pgTable("product_variant", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => productTable.id),
  name: text().notNull(),
  slug: text().notNull().unique(),
  color: text().notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  imageUrl: text("image_url").notNull(),
  createAt: timestamp("create_at").notNull().defaultNow(),
});

export const productVariantRelations = relations(
  productVariantTable,
  (params) => {
    return {
      product: params.one(productTable, {
        fields: [productVariantTable.productId],
        references: [productTable.id],
      }),
    };
  },
);
