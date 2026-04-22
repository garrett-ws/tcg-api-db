/** 
 * Finds the highest priced card (sealed product is filtered out) per set from db.prices
 * Performs a $lookup on the db.products and db.sets collections return more info about the cards found in db.prices
 * $projects the data collected into new objects and writes it to a target collection 
 * 
 * @returns db.price_summary collection, populated with objects containing info about the higest priced card per set
 * 
 */

db.prices.aggregate([
  {
    $set: { 
      max_price: { $max: ["$tcg.Normal.low", "$tcg.Normal.market", "$tcg.Holofoil.low", "$tcg.Holofoil.market"]},
      printing: {
        // The switch will be used to add the printing to the card
        $switch: {
          branches: [
          { case: { $eq: [{ $max: ["$tcg.Normal.low", "$tcg.Normal.market", "$tcg.Holofoil.low", "$tcg.Holofoil.market"] }, "$tcg.Holofoil.market"] }, then: "Holofoil" },
          { case: { $eq: [{ $max: ["$tcg.Normal.low", "$tcg.Normal.market", "$tcg.Holofoil.low", "$tcg.Holofoil.market"] }, "$tcg.Holofoil.low"] }, then: "Holofoil" },
          { case: { $eq: [{ $max: ["$tcg.Normal.low", "$tcg.Normal.market", "$tcg.Holofoil.low", "$tcg.Holofoil.market"] }, "$tcg.Normal.market"] }, then: "Normal" },
          { case: { $eq: [{ $max: ["$tcg.Normal.low", "$tcg.Normal.market", "$tcg.Holofoil.low", "$tcg.Holofoil.market"] }, "$tcg.Normal.low"] }, then: "Normal" },
        ],
          default: "Unknown"
        }
      }
    }
  },
  {
  $group: {
    _id: "$set_id",
    most_expensive: { 
      $top: {
        sortBy: { max_price: -1 },
        output: { price: "$max_price", product_id: "$product_id", printing: "$printing" }
        }
      }
    }
  },
  {
    $set: {
      product_id: "$most_expensive.product_id",
      high_price: "$most_expensive.price",
      printing: "$most_expensive.printing"
    }
  }, 
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
  {
    $match: { "product.number": { $ne: null } } // This filters out sealed products
  },
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
  {
    $project: {
      set_id: "$_id",
      high_price: "$high_price",
      card_name: "$product.name",
      set_name: "$set.name",
      printing: "$printing"
    }
  },
  {
    $out: "prices_summary"
  }  
])