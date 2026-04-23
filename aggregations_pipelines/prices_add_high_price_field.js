/**
 * Prerequisites: field_corrections.js must be run first to update field names and correct data types
 * 
 * Adds a field for the highest price for a card and another for the respective printing
 * 
 */

// Adds the highest price and highest price 
db.prices.updateMany(
  {},
  [{
    $set: { 
      tcg_high_price: { $max: [
        "$tcg.normal.low", "$tcg.normal.market",
        "$tcg.foil.low", "$tcg.foil.market",
        "$tcg.holofoil.low", "$tcg.holofoil.market",
        "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
        "$tcg.1st_edition.low", "$tcg.1st_edition.market",
        "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
        "$tcg.unlimited.low", "$tcg.unlimited.market",
        "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"
      ]},
      tcg_high_price_printing: {
        $switch: {
          branches: [
            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"] 
              }, "$tcg.normal.market"] }, then: "Normal" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"] 
              }, "$tcg.normal.low"] }, then: "Normal" },
              
            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.foil.market"] }, then: "Foil" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.foil.low"] }, then: "Foil" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.holofoil.market"] }, then: "Holofoil" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.holofoil.low"] }, then: "Holofoil" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.reverse_holofoil.market"] }, then: "Reverse Holofoil" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.reverse_holofoil.low"] }, then: "Reverse Holofoil" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.1st_edition.market"] }, then: "1st Edition" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.1st_edition.low"] }, then: "1st Edition" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.1st_edition_holofoil.market"] }, then: "1st Edition Holofoil" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.1st_edition_holofoil.low"] }, then: "1st Edition Holofoil" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.unlimited.market"] }, then: "Unlimited" },

            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.unlimited.low"] }, then: "Unlimited" },
            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.unlimited_holofoil.market"] }, then: "Unlimited Holofoil" },
            { case: { $eq: [{ $max: ["$tcg.normal.low", "$tcg.normal.market", "$tcg.foil.low", "$tcg.foil.market",
                "$tcg.holofoil.low", "$tcg.holofoil.market", "$tcg.reverse_holofoil.low", "$tcg.reverse_holofoil.market",
                "$tcg.1st_edition.low", "$tcg.1st_edition.market", "$tcg.1st_edition_holofoil.low", "$tcg.1st_edition_holofoil.market",
                "$tcg.unlimited.low", "$tcg.unlimited.market", "$tcg.unlimited_holofoil.low", "$tcg.unlimited_holofoil.market"]
              }, "$tcg.unlimited_holofoil.low"] }, then: "Unlimited Holofoil" },
          ],
          default: "Unknown"
        }
      }
    }
  }]
)