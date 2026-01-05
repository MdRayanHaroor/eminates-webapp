import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# 1. Update existing Solar products
updates = {
    "solar-epc": {
        "name": "SOLAR EPC SERVICE MODEL",
        "solutions": [
            "Engineering & design",
            "Material supply",
            "Installation & civil work",
            "Testing & commissioning",
            "Grid synchronization"
        ]
        # Keep features/usages from previous or overwrite if specific new info contradicts? 
        # User prompt provides specific "EPC Includes" which maps to solutions. 
        # Previous "features" had capacity, "usages" had industries. I'll keep those as they are complementary.
    },
    "solar-consulting": {
        "name": "SOLAR CONSULTING & PROJECT DEVELOPMENT",
        "solutions": [ # Mapped from "Consulting Services"
             "Feasibility & ROI study",
             "Land & site assessment",
             "Statutory approvals",
             "Tender & project planning"
        ]
    },
    "solar-om": {
         "name": "SOLAR OPERATION & MAINTENANCE (O&M)",
         "solutions": [ # Mapped from "O&M Scope"
            "Panel cleaning",
            "Performance monitoring",
            "Preventive maintenance",
            "AMC contracts"
         ]
    }
}

# 2. Add New Solar Plant Types
new_solar_plants = [
    {
        "id": "rooftop-solar",
        "name": "ROOFTOP SOLAR POWER PLANT (INDUSTRIAL / COMMERCIAL)",
        "category": "Solar",
        "image": [
            "https://placehold.co/600x400?text=Rooftop+Solar",
            "https://placehold.co/600x400?text=Industrial+Roof+Panels",
            "https://placehold.co/600x400?text=Warehouse+Solar",
            "https://placehold.co/600x400?text=Commercial+Solar"
        ],
        "purpose": "Solar panels installed on factory, warehouse, shed, or commercial building roofs.",
        "features": [ # Benefits
            "Saves electricity cost",
            "Uses unused roof space",
            "Quick installation",
            "Capacity: 5 kW to 5 MW"
        ],
        "usages": [ # Best For
            "Factories & manufacturing units",
            "Warehouses & logistics parks",
            "Commercial buildings, hospitals, schools"
        ]
    },
    {
        "id": "ground-mounted-solar",
        "name": "GROUND MOUNTED / GRASS LEVEL SOLAR (UTILITY SCALE)",
        "category": "Solar",
        "image": [
            "https://placehold.co/600x400?text=Ground+Mounted+Solar",
            "https://placehold.co/600x400?text=Solar+Park",
            "https://placehold.co/600x400?text=Utility+Scale+Solar",
            "https://placehold.co/600x400?text=Mega+Watt+Scale"
        ],
        "purpose": "Solar plant considered on open land / grass level, suitable for large-scale power generation.",
        "features": [
            "High generation capacity",
            "Easy maintenance",
            "Best for long-term returns",
            "Capacity: 1 MW to 50 MW"
        ],
        "usages": [
            "Land owners",
            "Industrial captive plants",
            "Utility & IPP projects"
        ]
    },
    {
        "id": "solar-carport",
        "name": "SOLAR CARPORT / PARKING SOLAR",
        "category": "Solar",
        "image": [
            "https://placehold.co/600x400?text=Solar+Carport",
            "https://placehold.co/600x400?text=Parking+Lot+Solar",
            "https://placehold.co/600x400?text=EV+Charging+Solar",
            "https://placehold.co/600x400?text=Shaded+Parking"
        ],
        "purpose": "Solar panels mounted on parking shades, generating power while providing shade.",
        "features": [
            "Dual use of space",
            "Vehicle protection",
            "Clean energy generation"
        ],
        "usages": [
            "Factories",
            "Malls & IT parks",
            "Airports & institutions"
        ]
    },
    {
        "id": "floating-solar",
        "name": "FLOATING SOLAR POWER PLANT",
        "category": "Solar",
        "image": [
            "https://placehold.co/600x400?text=Floating+Solar",
            "https://placehold.co/600x400?text=Reservoir+Solar",
            "https://placehold.co/600x400?text=Water+Surface+Panels",
            "https://placehold.co/600x400?text=Floating+PV"
        ],
        "purpose": "Solar plant installed on water bodies like reservoirs, ponds, and lakes.",
        "features": [
            "Reduces water evaporation",
            "Higher efficiency",
            "No land requirement"
        ],
        "usages": [
            "Water treatment plants",
            "Reservoir owners",
            "Government & utility projects"
        ]
    },
    {
        "id": "captive-solar",
        "name": "CAPTIVE SOLAR POWER PLANT",
        "category": "Solar",
        "image": [
            "https://placehold.co/600x400?text=Captive+Power+Plant",
            "https://placehold.co/600x400?text=Factory+Dedicated+Solar",
            "https://placehold.co/600x400?text=Industrial+Power",
            "https://placehold.co/600x400?text=Self+Consumption+Solar"
        ],
        "purpose": "Solar plant exclusively built for one industry\u2019s own power consumption.",
        "features": [
             "Stable power cost",
             "Energy security",
             "Long-term savings"
        ],
        "usages": [
            "High power-consuming industries",
            "Manufacturing plants"
        ]
    },
    {
        "id": "open-access-solar",
        "name": "OPEN ACCESS SOLAR PROJECT",
        "category": "Solar",
        "image": [
            "https://placehold.co/600x400?text=Open+Access+Solar",
            "https://placehold.co/600x400?text=Grid+Wheeling",
            "https://placehold.co/600x400?text=Remote+Solar",
            "https://placehold.co/600x400?text=PPA+Model"
        ],
        "purpose": "Solar power generated at one location and wheeled through grid to consumers at another location.",
        "features": [
             "Cheaper green power",
             "Long-term PPAs",
             "Government policy benefits"
        ],
        "usages": [
            "Industries without roof/land",
            "Multiple consumers"
        ]
    },
    {
        "id": "hybrid-solar",
        "name": "HYBRID SOLAR SYSTEM (SOLAR + DIESEL / BATTERY)",
        "category": "Solar",
        "image": [
            "https://placehold.co/600x400?text=Hybrid+Solar",
            "https://placehold.co/600x400?text=Battery+Storage",
            "https://placehold.co/600x400?text=Solar+Diesel+Hybrid",
            "https://placehold.co/600x400?text=Off+Grid+System"
        ],
        "purpose": "Combination of solar + battery + DG / grid for uninterrupted power.",
        "usages": [
            "Remote locations", "Critical industries", "Telecom & infrastructure"
        ]
    }
]

# Apply updates
for p in products:
    if p['id'] in updates:
        p.update(updates[p['id']])

# Append new
for np in new_solar_plants:
    # Check if exists to avoid dupes if re-run
    found = False
    for p in products:
        if p['id'] == np['id']:
             p.update(np)
             found = True
             break
    if not found:
        products.append(np)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4)

print("Refined Solar products successfully.")
