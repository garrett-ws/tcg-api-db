/**
 * Creates that indexes needed for our aggregation pipeline to function
 */

// db.prices and db.prices_current have the sasme indexes

/**
 * db.prices
 */

// This index is for the older version of the pipeline
// If the pipeline is successfully updated then this can be dropped
db.prices.createIndex(  
  { "tcg.normal.low": 1, "set_id": -1, "product_id": 1 },
  { name: "idx_prices_legacy_pipeline" }
)

// Used for an in progress version of the pipeline, may not end up
// being used
db.prices.createIndex(
  { "date_updated": -1, "product_id": 1 },
  { name: "idx_prices_date_product" }
)

db.prices.createIndex(
  { "high_price": -1 },
  { name: "idx_prices_high_price" }
)

db.prices.createIndex(
  { "tcg_high_price": -1 },
  { name: "idx_prices_tcg_high_price" }
)

/**
 * db.prices_current
 */

// This index is for the older version of the pipeline
// If the pipeline is successfully updated then this can be dropped
db.prices_current.createIndex(  
  { "tcg.normal.low": 1, "set_id": -1, "product_id": 1 },
  { name: "idx_prices_legacy_pipeline" }
)

// Used for an in progress version of the pipeline, may not end up
// being used
db.prices_current.createIndex(
  { "date_updated": -1, "product_id": 1 },
  { name: "idx_prices_date_product" }
)

db.prices_current.createIndex(
  { "high_price": -1 },
  { name: "idx_prices_high_price" }
)

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