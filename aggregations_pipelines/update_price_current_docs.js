/**
 * Various updates to the db.prices_current needed before the aggregation pipeline can be run
 * 
 * Prerequisites: field_corrections.js must be run first to update field names and correct data types
 * 
 * Note: that the indexes must also be created, these are stored in the create_indexes.js file,
 * as there are also indexes needed for other collections
 * 
 */

// Adds the highest price and highest price 
db.prices_current.updateMany(
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
