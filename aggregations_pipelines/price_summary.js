  /** 
   * Finds the highest priced card (sealed product is filtered out) per set from db.prices
   * Performs a $lookup on the db.products and db.sets collections return more info about the cards found in db.prices
   * $projects the data collected into new objects and writes it to a target collection 
   * 
   * @returns db.price_summary collection, populated with objects containing info about the higest priced card per set
   * 
   */

  db.prices.aggregate([  
    // Sort and group to get just the most recent price for each product listing
    {
      $sort: { date_updated: -1 }
    },
    {
      $group: {
        _id: "$product_id",
        tcg_high_price: { $first: "$tcg_high_price" },
        tcg_high_price_printing: { $first: "$tcg_high_price_printing" },
        set_id: { $first: "$set_id" }
      }
    },
    // Filter out cards that don't have a tcg_high_price, usually these products only have
    // data on another tcg market platform instead of tcgplayer
    {
      $match: { tcg_high_price: { $ne:  null }}
    },      
    // Group and sort the highest priced products per set  
    {
    $group: {
      _id: "$set_id",
      most_expensive: { 
        $top: {
          sortBy: { tcg_high_price: -1 },
          output: { price: "$tcg_high_price", product_id: "$_id", printing: "$tcg_high_price_printing" }
          }
        }
      }
    },
    // Set the fields from the $most_expensive object to top level fields
    {
      $set: {
        product_id: "$most_expensive.product_id",
        high_price: "$most_expensive.price",
        printing: "$most_expensive.printing"
      }
    }, 
    // Join the db.products collection to db.prices
    {
      $lookup: {
        from: "products",
        localField: "product_id",
        foreignField: "product_id",
        as: "product"
      }
    },
    {
      $unwind: "$product"
    },
    // Filter out sealed products
    {
      $match: { "product.number": { $ne: null } }
    },
    // Join the db.sets collection to db.prices
    {
      $lookup: {
        from: "sets",
        localField: "_id",
        foreignField: "set_id",
        as: "set"
      }
    },
    {
      $unwind: "$set"
    },
    // Create the documents with the desired fields
    {
      $project: {
        set_id: "$_id",
        price: "$high_price",
        card_name: "$product.name",
        set_name: "$set.name",
        printing: "$printing"
      }
    },
    // Write the documents to the target collection (this will overwrite existing collections)
    {
      $out: "prices_most_expensive_pre_agg"
    }  
  ],   
)