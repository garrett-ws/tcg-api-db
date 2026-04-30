    /** 
     * Finds the highest priced card (sealed product is filtered out) per set from db.prices
     * Performs a $lookup on the db.products and db.sets collections return more info about the cards found in db.prices
     * $projects the data collected into new objects and writes it to a target collection 
     * 
     * Prerequisites:
     *  Must be run in order:
     *  1). field_corrections.js must have run successfully to update field names so that indexes can be created, additional fields can be added,
     *        and the pipeline can match field names correctly   
     *  2). prices_add_high_price_fields.hs must have run successfully to add additional fields to the db.prices collections, and so that
     *        indexes can be created for these new fields (as needed)
     *  3). create_indexes.js must have run successfully to create the indexes, else the pipeline will time out
     * 
     * @returns db.prices_most_expensive collection, populated with objects containing info about the higest priced card per set
     * 
     */

    db.prices_current.aggregate([  
  
      // Filter out cards that don't have a tcg_high_price, most likely these products
      // only have data on another tcg market platform instead of tcgplayer
      {
        $match: { tcg_high_price: { $ne:  null }}
      },
      // Filter out non-card products
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
      // All cards have a product number, so anything that is null is a non-card product
      {
        $match: { "product.number": { $ne: null } }
      },
      // Group and sort the highest priced products per set  
      {
      $group: {
        _id: "$set_id",
        most_expensive: { 
          $top: {
            sortBy: { tcg_high_price: -1},
            output: { price: "$tcg_high_price", product_id: "$product_id", printing: "$tcg_high_price_printing", updated: "$updated"}
            }
          }
        }
      },
      // Set the fields from the $most_expensive object to top level fields
      {
        $set: {
          product_id: "$most_expensive.product_id",
          high_price: "$most_expensive.price",
          printing: "$most_expensive.printing",
          updated: "$most_expensive.updated"
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
          printing: "$printing",
          updated: "$updated"
        }
      },
      // Write the documents to the target collection (this will
      // overwrite existing collections)
      {
        $out: "prices_most_expensive"
      }  
    ],  
      { allowDiskUse: true }
  )