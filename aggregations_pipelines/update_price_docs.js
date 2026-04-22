/**
 * Various updates to the db.prices needed before the aggregation pipeline can be run
 */

// Change the product_id field from a string to an int
db.prices.updateMany(
  {},
  [{ $set: { product_id: { $toInt: "$product_id" } } }]
)

// Renames the tcg.Reverse Holofoil to remove the space
db.prices.updateMany(
  {},
  { $rename: { "tcg.Reverse Holofoil": "tcg.Reverse_Holofoil" } }
)

// Adds the highest price and highest price 
db.prices.updateMany(
  {},
  [{
    $set: { 
      tcg_high_price: { $max: ["$tcg.Normal.low", "$tcg.Normal.market", 
                  "$tcg.Holofoil.low", "$tcg.Holofoil.market",
                  "$tcg.Reverse_Holofoil.low", "$tcg.Reverse_Holofoil.market"]},
      tcg_high_price_printing: {
        // The switch will be used to add the printing to the card
        $switch: {
          branches: [          
            { case: { $eq: [{ $max: ["$tcg.Normal.low", "$tcg.Normal.market", "$tcg.Holofoil.low", "$tcg.Holofoil.market", "$tcg.Reverse_Holofoil.low", "$tcg.Reverse_Holofoil.market"] },
                  "$tcg.Normal.market"] }, then: "Normal" },
            { case: { $eq: [{ $max: ["$tcg.Normal.low", "$tcg.Normal.market", "$tcg.Holofoil.low", "$tcg.Holofoil.market", "$tcg.Reverse_Holofoil.low", "$tcg.Reverse_Holofoil.market"] },
                  "$tcg.Normal.low"] }, then: "Normal" },
            { case: { $eq: [{ $max: ["$tcg.Normal.low", "$tcg.Normal.market", "$tcg.Holofoil.low", "$tcg.Holofoil.market", "$tcg.Reverse_Holofoil.low", "$tcg.Reverse_Holofoil.market"] }, 
                  "$tcg.Holofoil.market", ] }, then: "Holofoil" },
            { case: { $eq: [{ $max: ["$tcg.Normal.low", "$tcg.Normal.market", "$tcg.Holofoil.low", "$tcg.Holofoil.market", "$tcg.Reverse_Holofoil.low", "$tcg.Reverse_Holofoil.market"] },
                  "$tcg.Holofoil.low"] }, then: "Holofoil" },
            { case: { $eq: [{ $max: ["$tcg.Normal.low", "$tcg.Normal.market", "$tcg.Holofoil.low", "$tcg.Holofoil.market", "$tcg.Reverse_Holofoil.low", "$tcg.Reverse_Holofoil.market"] },
                  "$tcg.Reverse_Holofoil.market"] }, then: "Reverse Holofoil" },
            { case: { $eq: [{ $max: ["$tcg.Normal.low", "$tcg.Normal.market", "$tcg.Holofoil.low", "$tcg.Holofoil.market", "$tcg.Reverse_Holofoil.low", "$tcg.Reverse_Holofoil.market"] },
                  "$tcg.Reverse_Holofoil.low"] }, then: "Reverse Holofoil" },
        ],
          default: "Unknown"
        }
      }
    }
  }]
)