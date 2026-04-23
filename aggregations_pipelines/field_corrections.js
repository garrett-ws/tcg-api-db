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
  { "id": { $exists: true } },
  { $rename: { "id" : "category_id" } }
)

/**
 * db.prices
 */

// There are multiple prices collections that use the same fixes, only the name differs.
// Pass the collection name to the pricesCollectionFixes function to fix each respectively
function pricesCollectionsFixes(collectionName) {
  const collection = db.getCollection(collectionName);

  // Renames the product field to product_id
  collection.updateMany(
    { "product": { $exists: true } },
    { $rename: { "product" : "product_id" } }
  )

  // Converts the product_id field from a string to an int
  collection.updateMany(
    { "product_id": { $exists: true } },
    [{ $set: { product_id: { $toInt: "$product_id" } } }]
  )

  // Rename the tcg.Normal field to lowercase
  collection.updateMany(
    { "tcg.Normal": { $exists: true } },
    { $rename: { "tcg.Normal": "tcg.normal" }}
  )

  // Renames the tcg.foil to remove the space and be lowercase
  collection.updateMany(
    { "tcg.Foil": { $exists: true } },
    { $rename: { "tcg.Foil": "tcg.foil" } }
  )

  // Renames the tcg.Holofoil to remove the space and be lowercase
  collection.updateMany(
    { "tcg.Holofoil": { $exists: true } },
    { $rename: { "tcg.Holofoil": "tcg.holofoil" } }
  ) 

  // Renames the tcg.Reverse Holofoil to remove the space and be lowercase
  collection.updateMany(
    { "tcg.Reverse Holofoil": { $exists: true } },
    { $rename: { "tcg.Reverse Holofoil": "tcg.reverse_holofoil" } }
  ) 

  // Renames the tcg.1st Edition to remove the space and be lowercase
  collection.updateMany(
    { "tcg.1st Edition": { $exists: true } },
    { $rename: { "tcg.1st Edition": "tcg.1st_edition" } }
  ) 

    // Renames the tcg.1st Edition to remove the space and be lowercase
  collection.updateMany(
    { "tcg.1st Edition": { $exists: true } },
    { $rename: { "tcg.1st Edition": "tcg.1st_edition" } }
  ) 

  // Renames the tcg.1st Edition Holofoil to remove the space and be lowercase
  collection.updateMany(
    { "tcg.1st Edition Holofoil": { $exists: true } },
    { $rename: { "tcg.1st Edition Holofoil": "tcg.1st_edition_holofoil" } }
  ) 

  // Renames the tcg.Unlimited to remove the space and be lowercase
  collection.updateMany(
    { "tcg.Unlimited": { $exists: true } },
    { $rename: { "tcg.Unlimited": "tcg.unlimited" } }
  ) 

  // Renames the tcg.Unlimited Holofoil to remove the space and be lowercase
  collection.updateMany(
    { "tcg.Unlimited Holofoil": { $exists: true } },
    { $rename: { "tcg.Unlimited Holofoil": "tcg.unlimited_holofoil" } }
  ) 
}

pricesCollectionsFixes("prices");

/**
 * db.prices_current
 */

pricesCollectionsFixes("prices_current");

/**
 * db.products
 */

// Renames id field
db.products.updateMany(
  { "id": { $exists: true } },
  { $rename: { "id" : "product_id" } }
)

/**
 * db.sets
 */

// Renames id field
db.sets.updateMany(
  { "id": { $exists: true } },
  { $rename: { "id" : "set_id" } }
)

/**
 * db.skus
 */

// Renames the product field to product_id
db.skus.updateMany(
  { "product_id": { $exists: true } },
  { $rename: { "product" : "product_id" } }
)

// Converts the product_id field from a string to an int
db.skus.updateMany(
  { "product_id": { $exists: true } },
  [{ $set: { product_id: { $toInt: "$product_id" } } }]
)

// Converts the listing field from a string to an int
db.skus.updateMany(
  { "listing": { $exists: true } },
  [{ $set: { listing: { $toInt: "$listing" } } }]
)