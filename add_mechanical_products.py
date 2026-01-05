import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# Define new mechanical products
new_mech_products = [
    {
        "id": "industrial-bearings",
        "name": "INDUSTRIAL BEARINGS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Industrial+Bearings",
        "usages": ["Motors, pumps, gearboxes, conveyors"],
        "sub_products": ["Ball", "Roller", "Taper", "Spherical"],
        "purpose": "Reduce friction and support loads in machinery."
    },
    {
        "id": "oil-seals",
        "name": "OIL SEALS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Oil+Seals",
        "usages": ["Shafts, gearboxes, pump"],
        "purpose": "Prevent oil leakage & dust entry"
    },
    {
        "id": "shafts",
        "name": "SHAFTS (MS / EN / SS)",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Industrial+Shafts",
        "usages": ["Power transmission"],
        "material": "MS, EN8, EN19, SS",
        "purpose": "Transmitting power and rotation."
    },
    {
        "id": "pulleys",
        "name": "PULLEYS (V / FLAT)",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Pulleys",
        "usages": ["Belt drive system", "Manufacturing, conveyors"],
        "purpose": "Transmitting torque in belt systems."
    },
    {
        "id": "couplings",
        "name": "COUPLINGS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Couplings",
        "usages": ["Motor\u2013pump connection"],
        "sub_products": ["Flexible", "Gear", "Jaw"],
        "purpose": "Connecting two shafts together for power transmission."
    },
    {
        "id": "gear-boxes",
        "name": "GEAR BOXES",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Gear+Boxes",
        "usages": ["Speed reduction", "Cement, steel, conveyors"],
        "purpose": "Torque increase and speed reduction."
    },
    {
        "id": "gears",
        "name": "GEARS (SPUR / HELICAL)",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Gears",
        "usages": ["Power transmission"],
        "material": "Alloy steel, MS",
        "purpose": "Transmitting motion and force."
    },
    {
        "id": "chains-sprockets",
        "name": "CHAINS & SPROCKETS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Chains+and+Sprockets",
        "usages": ["Conveyors, elevator"],
        "sub_products": ["Roller", "Duplex", "Triplex"],
        "purpose": "Chain drive systems for power transmission."
    },
    {
        "id": "belts",
        "name": "V-BELTS & TIMING BELTS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=V+Belts",
        "usages": ["Motors, compressor"],
        "features": ["Smooth power transfer"],
        "purpose": "Belt drive power transmission."
    },
    {
        "id": "fasteners",
        "name": "FASTENERS (BOLTS & NUTS)",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Industrial+Fasteners",
        "material": "MS, SS, HT",
        "usages": ["Assembly & structure"],
        "purpose": "Joining industrial components."
    },
    {
        "id": "industrial-springs",
        "name": "INDUSTRIAL SPRINGS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Industrial+Springs",
        "usages": ["Shock absorption"],
        "sub_products": ["Compression", "Tension"],
        "purpose": "Energy storage and shock absorption."
    },
    {
        "id": "bushes-sleeves",
        "name": "BUSHES & SLEEVES",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Bushes+and+Sleeves",
        "usages": ["Reduce friction"],
        "material": "Bronze, Nylon, PU",
        "purpose": "Bearing surfaces and friction reduction."
    },
    {
        "id": "valves",
        "name": "VALVES (INDUSTRIAL)",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Industrial+Valves",
        "sub_products": ["Gate", "Globe", "Ball", "Butterfly"],
        "usages": ["Fluid control"],
        "purpose": "Regulating fluid flow."
    },
    {
        "id": "pumps",
        "name": "PUMPS (INDUSTRIAL)",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Industrial+Pumps",
        "usages": ["Water, chemicals, oil"],
        "sub_products": ["Centrifugal", "Gear"],
        "purpose": "Moving fluids in industrial processes."
    },
    {
        "id": "flanges",
        "name": "FLANGES",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Flanges",
        "usages": ["Pipe connections"],
        "material": "MS, SS",
        "purpose": "Connecting pipes, valves, and pumps."
    },
    {
        "id": "mechanical-seals",
        "name": "MECHANICAL SEALS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Mechanical+Seals",
        "usages": ["Pumps & compressors"],
        "purpose": "Leak prevention"
    },
    {
        "id": "industrial-lubricants-mech",
        "name": "INDUSTRIAL LUBRICANTS & GREASE",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Lubricants",
        "usages": ["Bearings, gear"],
        "sub_products": ["Hydraulic oil", "Gear oil"],
        "purpose": "Reducing friction and wear."
    },
    {
        "id": "conveyor-rollers",
        "name": "CONVEYOR ROLLERS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Conveyor+Rollers",
        "usages": ["Material handling systems"],
        "purpose": "Supporting conveyor belts and materials."
    },
    {
        "id": "hollow-block-ms",
        "name": "HOLLOW BLOCK & STRUCTURAL MS ITEMS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Structural+MS+Items",
        "usages": ["Industrial structures"],
        "purpose": "Construction of industrial frameworks."
    },
    {
        "id": "hydraulic-cylinders",
        "name": "HYDRAULIC CYLINDERS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Hydraulic+Cylinders",
        "usages": ["Heavy machinery"],
        "purpose": "Linear force generation via hydraulics."
    },
    {
        "id": "pneumatic-cylinders",
        "name": "PNEUMATIC CYLINDERS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Pneumatic+Cylinders",
        "usages": ["Automation & robotics"],
        "purpose": "Linear motion via compressed air."
    },
    {
        "id": "casting-forging",
        "name": "CASTING & FORGING PARTS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Casting+and+Forging",
        "usages": ["Heavy equipment"],
        "purpose": "Custom metal parts for machinery."
    },
    {
        "id": "machine-spares",
        "name": "MACHINE SPARE PARTS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Machine+Spare+Parts",
        "usages": ["Maintenance & breakdown"],
        "purpose": "Replacement parts for industrial machines."
    },
    {
        "id": "safety-guards",
        "name": "SAFETY GUARDS & COVERS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Safety+Guards",
        "usages": ["Operator safety"],
        "purpose": "Protecting operators and equipment."
    },
    {
        "id": "custom-fabricated",
        "name": "CUSTOM FABRICATED ITEMS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Custom+Fabrication",
        "usages": ["Project-based requirements"],
        "purpose": "Tailor-made mechanical solutions."
    },
    {
        "id": "impellers",
        "name": "IMPELLERS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Impellers",
        "usages": ["Pumps, blowers", "Chemical, water, power"],
        "purpose": "Fluid movement & pressure generation"
    },
    {
        "id": "fan-blowers",
        "name": "FAN & BLOWER ASSEMBLIES",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Fan+and+Blowers",
        "usages": ["Air handling, cooling", "Cement, steel, chemical"],
        "purpose": "Industrial air movement."
    },
    {
        "id": "heat-exchangers",
        "name": "HEAT EXCHANGERS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Heat+Exchangers",
        "usages": ["Cooling & heating processes", "Oil & gas, power, chemical"],
        "purpose": "Transferring heat between fluids."
    },
    {
        "id": "pressure-vessels",
        "name": "PRESSURE VESSELS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Pressure+Vessels",
        "usages": ["Storage under pressure", "Chemical, refinery, pharma"],
        "purpose": "Containing fluids under pressure."
    },
    {
        "id": "storage-tanks",
        "name": "STORAGE TANKS (MS / SS)",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Storage+Tanks",
        "usages": ["Chemical & liquid storage", "Chemical, water, food"],
        "purpose": "Bulk liquid storage."
    },
    {
        "id": "expansion-joints",
        "name": "EXPANSION JOINTS & BELLOWS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Expansion+Joints",
        "usages": ["Pipelines"],
        "purpose": "Absorb vibration & thermal expansion"
    },
    {
        "id": "dampers-louvers",
        "name": "DAMPERS & LOUVERS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Dampers+and+Louvers",
        "usages": ["Air & gas flow control", "Power, cement, HVAC"],
        "purpose": "Flow regulation in ducts."
    },
    {
        "id": "screw-conveyors",
        "name": "SCREW CONVEYORS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Screw+Conveyors",
        "usages": ["Material handling", "Cement, food, chemical"],
        "purpose": "Transporting bulk materials."
    },
    {
        "id": "bucket-elevators",
        "name": "BUCKET ELEVATORS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Bucket+Elevators",
        "usages": ["Vertical material transfer", "Cement, mining, fertilizer"],
        "purpose": "Vertical bulk material handling."
    },
    {
        "id": "vibratory-screens",
        "name": "VIBRATORY SCREENS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Vibratory+Screens",
        "usages": ["Screening & separation", "Mining, aggregates, cement"],
        "purpose": "Sizing and separating materials."
    },
    {
        "id": "crusher-spares",
        "name": "CRUSHER SPARES",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Crusher+Spares",
        "usages": ["Crushers", "Mining, cement, quarry"],
        "purpose": "Replacement parts for rock crushers."
    },
    {
        "id": "wear-plates",
        "name": "WEAR PLATES & LINERS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Wear+Plates",
        "usages": ["High abrasion zones", "Mining, cement"],
        "purpose": "Protecting equipment from abrasion."
    },
    {
        "id": "hydraulic-power-packs",
        "name": "HYDRAULIC POWER PACKS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Hydraulic+Power+Packs",
        "usages": ["Heavy machinery", "Steel, automation, presses"],
        "purpose": "Generating hydraulic power."
    },
    {
        "id": "pneumatic-frl",
        "name": "PNEUMATIC FRL UNITS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Pneumatic+FRL",
        "usages": ["Pneumatic systems", "Automation, packaging"],
        "purpose": "Filter, Regulator, Lubricator for air systems."
    },
    {
        "id": "material-trolleys",
        "name": "MATERIAL HANDLING TROLLEYS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Material+Trolleys",
        "usages": ["Shop floor movement", "All manufacturing units"],
        "purpose": "Manual transport of goods."
    },
    {
        "id": "lifting-slings",
        "name": "LIFTING SLINGS & CHAINS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Lifting+Slings",
        "usages": ["Lifting operations", "EPC, steel, power"],
        "purpose": "Safe lifting of heavy loads."
    },
    {
        "id": "wire-ropes",
        "name": "WIRE ROPES",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Wire+Ropes",
        "usages": ["Cranes, hoists", "Mining, ports, construction"],
        "purpose": "Heavy dry lifting and suspension."
    },
    {
        "id": "cranes-hoists",
        "name": "CRANES & HOISTS (SPARES)",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Cranes+and+Hoists",
        "usages": ["Heavy lifting", "Steel, manufacturing"],
        "purpose": "Components for lifting equipment."
    },
    {
        "id": "gaskets-packings",
        "name": "GASKETS & PACKINGS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Gaskets+and+Packings",
        "usages": ["Flanges & pumps", "Chemical, oil & gas"],
        "purpose": "Sealing connection points."
    },
    {
        "id": "filters-strainers",
        "name": "FILTERS & STRAINERS",
        "category": "Mechanical",
        "image": "https://placehold.co/600x400?text=Filters+and+Strainers",
        "usages": ["Fluid systems", "Chemical, water, oil"],
        "purpose": "Removing impurities from fluids."
    }
]

# Append new products (checking for duplicates within Mechanical category or by ID)
for np in new_mech_products:
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

print("Mechanical products added successfully.")
