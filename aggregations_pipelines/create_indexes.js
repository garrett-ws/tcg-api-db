/**
 * Creates that indexes needed for our aggregation pipeline to function
 */

// db.prices and db.prices_current have the sasme indexes

/**
 * db.prices
 */

db.prices.createIndex(
  { "tcg_high_price": -1 },
  { name: "idx_prices_tcg_high_price" }
)

/**
 * db.prices_current
 */

db.prices_current.createIndex(
  { "tcg_high_price": -1 },
  { name: "idx_prices_tcg_high_price" }
)

/**
 * db.products
 */
db.products.createIndex(
  { "set_id": 1 },
  { name: "idx_products_set" }
)

db.products.createIndex(
  { "product_id": 1 },
  { name: "idx_products_product" }
)

/**
 * db.sets
 */
db.sets.createIndex(
  { "set_id": 1 },
  { name: "idx_sets_set" }
)