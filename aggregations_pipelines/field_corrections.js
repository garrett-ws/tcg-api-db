/**
 * Various fixes for the field names from when they are imported
 * 
 * Many fields on import are named simply "id" for a collection, which is confusing when performing a $lookup
 * This renames the fields
 */

/**
 * db.categories
 */

// Rename the id field
db.categories.updateMany(
  {},
  { $rename: { "id" : "category_id" } }
)

/**
 * db.prices
 */

// Renames the product field to product_id
db.prices.updateMany(
  {},
  { $rename: { "product" : "product_id" } }
)

// Converts the product_id field from a string to an int
db.prices.updateMany(
  {},
  [{ $set: { product_id: { $toInt: "$product_id" } } }]
)

// Renames the tcg.Reverse Holofoil to remove the space
db.prices.updateMany(
  {},
  { $rename: { "tcg.Reverse Holofoil": "tcg.Reverse_Holofoil" } }
)

/**
 * db.prices_current
 */

// Renames the product field to product_id
db.prices_current.updateMany(
  {},
  { $rename: { "product" : "product_id" } }
)

// Converts the product_id field from a string to an int
db.prices_current.updateMany(
  {},
  [{ $set: { product_id: { $toInt: "$product_id" } } }]
)

// Renames the tcg.Reverse Holofoil to remove the space
db.prices_current.updateMany(
  {},
  { $rename: { "tcg.Reverse Holofoil": "tcg.Reverse_Holofoil" } }
)

/**
 * db.products
 */

// Renames id field
db.products.updateMany(
  {},
  { $rename: { "id" : "product_id" } }
)

/**
 * db.sets
 */

// Renames id field
db.sets.updateMany(
  {},
  { $rename: { "id" : "set_id" } }
)

/**
 * db.skus
 */

// Renames the product field to product_id
db.skus.updateMany(
  {},
  { $rename: { "product" : "product_id" } }
)

// Converts the product_id field from a string to an int
db.skus.updateMany(
  {},
  [{ $set: { product_id: { $toInt: "$product_id" } } }]
)

// Converts the listing field from a string to an int
db.skus.updateMany(
  {},
  [{ $set: { listing: { $toInt: "$listing" } } }]
)