import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# IDs to remove (consolidated ones)
ids_to_remove = ["circuit-protection", "contactors-relays"]
products = [p for p in products if p['id'] not in ids_to_remove]

# Definition of new/updated products
new_products_data = [
    {
        "id": "mcb",
        "name": "MCB \u2013 MINIATURE CIRCUIT BREAKER",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=MCB+Switch",
            "https://placehold.co/600x400?text=Distribution+Board+MCB",
            "https://placehold.co/600x400?text=MCB+Close+Up",
            "https://placehold.co/600x400?text=Circuit+Breaker"
        ],
        "purpose": "Protects electrical circuits from overload and short circuit.",
        "usages": [
            "Control panels", "Distribution boards", "Commercial & industrial buildings"
        ],
        "features": [
            "Fast tripping", "Compact design", "High safety & reliability"
        ]
    },
    {
        "id": "mccb",
        "name": "MCCB \u2013 MOLDED CASE CIRCUIT BREAKER",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=MCCB+Breaker",
            "https://placehold.co/600x400?text=Industrial+MCCB",
            "https://placehold.co/600x400?text=Power+Panel+MCCB",
            "https://placehold.co/600x400?text=Heavy+Duty+Breaker"
        ],
        "purpose": "Used for higher current protection in industrial power systems.",
        "usages": [
            "Industrial power panels", "Motors & heavy machinery", "Main incomer panels"
        ],
        "features": [
            "Adjustable trip settings", "High breaking capacity"
        ]
    },
    {
        "id": "acb",
        "name": "ACB \u2013 AIR CIRCUIT BREAKER",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Air+Circuit+Breaker",
            "https://placehold.co/600x400?text=ACB+Panel",
            "https://placehold.co/600x400?text=High+Current+ACB",
            "https://placehold.co/600x400?text=Power+Plant+ACB"
        ],
        "purpose": "Handles very high current protection for main LT panels and large factories.",
        "usages": [
            "Main LT panels", "Power plants", "Large factories"
        ],
        "features": [
            "Handles very high current", "Long electrical life"
        ]
    },
    {
        "id": "contactors",
        "name": "CONTACTORS",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Power+Contactor",
            "https://placehold.co/600x400?text=Motor+Contactor",
            "https://placehold.co/600x400?text=Contactor+Coil",
            "https://placehold.co/600x400?text=Switching+Device"
        ],
        "purpose": "Switches motors, pumps, and compressors automatically.",
        "usages": [
            "Motor control centers (MCC)", "Automation panels"
        ],
        "features": [
             "High switching frequency", "Robust design"
        ]
    },
    {
        "id": "relays",
        "name": "RELAYS (OVERLOAD / CONTROL)",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Overload+Relay",
            "https://placehold.co/600x400?text=Control+Relay",
            "https://placehold.co/600x400?text=Protection+Relay",
            "https://placehold.co/600x400?text=Thermal+Relay"
        ],
        "purpose": "Protects motors from overload & phase failure.",
        "usages": [
            "Motor starters", "Automation systems"
        ],
        "features": [
            "Precise protection", "Adjustable range"
        ]
    },
    {
        "id": "industrial-sockets",
        "name": "INDUSTRIAL SOCKETS & PLUGS",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Industrial+Socket",
            "https://placehold.co/600x400?text=Heavy+Duty+Plug",
            "https://placehold.co/600x400?text=3-Phase+Socket",
            "https://placehold.co/600x400?text=Power+Connector"
        ],
        "purpose": "Robust connection points for heavy machinery and temporary power.",
        "usages": [
            "Heavy machinery connection", "Temporary industrial power"
        ],
        "features": [
            "Waterproof / Dustproof options", "High impact resistance"
        ]
    },
    {
        "id": "industrial-cables",
        "name": "CABLES & WIRES (INDUSTRIAL)",
        "category": "Electric & Electronics",
        "sub_products": [
             "Power cables", "Control cables", "Instrumentation cables"
        ],
        "usages": [
            "Plant electrification", "Panel wiring"
        ],
        "purpose": "High-grade cabling for power transmission and signal connectivity."
        # Keep existing image or updated ones if I had them
    },
    {
        "id": "industrial-lighting",
        "name": "LED LIGHT FITTINGS \u2013 INDUSTRIAL",
        "category": "Electric & Electronics",
         "sub_products": [
            "LED High Bay Lights", "Flood Lights", "Street Lights"
        ],
        "usages": [
            "Factories", "Warehouses", "Yards & outdoor areas"
        ],
        "purpose": "Robust lighting solutions for large-scale industrial environments."
    },
     {
        "id": "panel-lights",
        "name": "PANEL LIGHTS & TUBE LIGHTS",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=LED+Panel+Light",
            "https://placehold.co/600x400?text=LED+Tube+Light",
            "https://placehold.co/600x400?text=Office+Lighting",
            "https://placehold.co/600x400?text=Cleanroom+Light"
        ],
        "purpose": "Efficient lighting for indoor workspaces and control rooms.",
        "usages": [
            "Control rooms", "Offices", "Production floors"
        ],
        "features": [
            "Energy efficient", "Even light distribution"
        ]
    },
    {
        "id": "ups-battery",
        "name": "UPS & POWER BACKUP SYSTEM",
        "category": "Electric & Electronics",
        "purpose": "Uninterrupted power supply solutions for critical systems.",
        "usages": [
            "Automation panels", "SCADA & PLC systems"
        ]
        # Keep sub_products/features from previous if needed, or overwrite if user gave less info. 
        # User gave less info here, but I will keep previous structure if existent to allow for richer data, 
        # but overwrite usages/name as requested.
    },
    {
         "id": "sensors-meters",
         "name": "ENERGY METERS & INSTRUMENTS",
         "category": "Electric & Electronics",
         "purpose": "Precision instruments for measurement and process monitoring.",
         "usages": [
             "Power monitoring", "Energy management"
         ]
    }
]

# Update or Append
for np in new_products_data:
    # Check if exists
    found = False
    for i, p in enumerate(products):
        if p['id'] == np['id']:
            # Update existing, preserve image if not provided in new data
            if 'image' not in np and 'image' in p:
                np['image'] = p['image']
            # Preserve definition of "Products Covered" (sub_products) if not overwritten
            if 'sub_products' not in np and 'sub_products' in p:
                 np['sub_products'] = p['sub_products']
            
            p.update(np)
            found = True
            break
    if not found:
        products.append(np)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4)

print("Refined Electric & Electronics products successfully.")
