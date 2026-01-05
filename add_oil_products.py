import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# 1. Rename existing category
for p in products:
    if p.get('category') == 'Lubricants':
        p['category'] = 'Oil & Lubricants'

# 2. Define new products
new_products = [
    {
        "id": "hydraulic-oil",
        "name": "HYDRAULIC OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Hydraulic+Oil",
        "features": ["Grades: ISO VG 32, 46, 68"],
        "usages": ["Hydraulic presses", "Injection moulding machines", "Excavators & heavy machinery", "Power plants & steel industries"],
        "packing": ["210 L barrels", "50 L drums", "IBC tanks (1000 L)"],
        "purpose": "Power transmission, lubrication, cooling & sealing in hydraulic systems."
    },
    {
        "id": "industrial-lubricating-oil",
        "name": "INDUSTRIAL LUBRICATING OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Industrial+Lube+Oil",
        "usages": ["Bearings", "Slideways", "Gears & chains", "Manufacturing plants", "Textile mills", "General engineering"],
        "purpose": "General purpose industrial lubrication."
    },
    {
        "id": "gear-oil",
        "name": "GEAR OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Gear+Oil",
        "features": ["Grades: ISO VG 150, 220, 320, 460"],
        "usages": ["Gearboxes", "Crushers", "Cement & mining equipment"],
        "purpose": "Special oil designed for high-load gears."
    },
    {
        "id": "grease",
        "name": "GREASE (MULTI-PURPOSE & HEAVY DUTY)",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Industrial+Grease",
        "sub_products": ["Lithium grease", "Calcium grease", "High-temperature grease", "EP grease"],
        "usages": ["Bearings", "Shafts & couplings", "Heavy machinery"],
        "packing": ["180 kg barrels", "18 kg buckets", "1 kg cartridges"],
        "purpose": "Heavy duty lubrication for moving parts."
    },
    {
        "id": "engine-oil",
        "name": "ENGINE OIL (INDUSTRIAL & COMERCIAL)",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Engine+Oil",
        "features": ["Grades: SAE 15W40, SAE 20W40"],
        "usages": ["DG sets", "Construction equipment", "Industrial engines"],
        "purpose": "Lubrication for internal combustion engines."
    },
    {
        "id": "compressor-oil",
        "name": "COMPRESSOR OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Compressor+Oil",
        "usages": ["Air compressors", "Refrigeration compressors", "Manufacturing", "Food & pharma (special grades)"],
        "purpose": "Lubrication for air and gas compressors."
    },
    {
        "id": "turbine-oil",
        "name": "TURBINE OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Turbine+Oil",
        "usages": ["Steam turbines", "Gas turbines", "Power plants", "Refineries"],
        "purpose": "High-quality oil for turbine lubrication."
    },
    {
        "id": "transformer-oil",
        "name": "TRANSFORMER OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Transformer+Oil",
        "usages": ["Transformers", "Electrical substations"],
        "purpose": "Cooling & insulation for transformers."
    },
    {
        "id": "cutting-oil",
        "name": "CUTTING OIL / METAL WORKING FLUID",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Cutting+Oil",
        "usages": ["CNC machines", "Lathes & milling machines"],
        "purpose": "Cooling and lubrication for metal cutting."
    },
    {
        "id": "way-oil",
        "name": "WAY OIL (SLIDEWAY OIL)",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Way+Oil",
        "usages": ["CNC guideways", "Machine slides"],
        "purpose": "Lubrication for machine tool slideways."
    },
    {
        "id": "specialty-oils",
        "name": "SPECIALTY & PROCESS OILS",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Specialty+Oils",
        "usages": ["Rubber & tyre industry", "Plastic processing", "Chemical industries"],
        "purpose": "Oils for specific industrial processes."
    },
    {
        "id": "heat-transfer-oil",
        "name": "HEAT TRANSFER OIL (THERMIC FLUID)",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Heat+Transfer+Oil",
        "usages": ["Boilers, heaters, reactors", "Chemical, textile, food, pharma"],
        "packing": ["210 L barrels", "IBC tanks"],
        "features": ["Stable at high temperature", "Long service life"],
        "purpose": "Heat transfer medium."
    },
    {
        "id": "fire-resistant-hydraulic-oil",
        "name": "FIRE-RESISTANT HYDRAULIC OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Fire+Resistant+Oil",
        "usages": ["High-risk areas", "Steel mills, foundries, mining"],
        "sub_products": ["HFA", "HFB", "HFC", "HFD"],
        "packing": ["Drums", "IBC"],
        "purpose": "Hydraulic fluid for fire-hazard environments."
    },
    {
        "id": "synthetic-gear-oil",
        "name": "SYNTHETIC GEAR OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Synthetic+Gear+Oil",
        "usages": ["Heavy-load & high-temp gearboxes", "Cement, mining, wind energy"],
        "features": ["Grades: ISO VG 220\u2013680", "Extended drain interval"],
        "purpose": "High-performance gear lubrication."
    },
    {
        "id": "refrigeration-compressor-oil",
        "name": "REFRIGERATION COMPRESSOR OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Refrigeration+Oil",
        "usages": ["Refrigeration & chillers", "Cold storage, food processing"],
        "sub_products": ["Mineral", "Synthetic"],
        "packing": ["Drums", "Cans"],
        "purpose": "Lubrication for refrigeration systems."
    },
    {
        "id": "rust-preventive-oil",
        "name": "RUST PREVENTIVE OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Rust+Preventive+Oil",
        "usages": ["Fabrication, export packing"],
        "packing": ["Drums", "Sprays"],
        "purpose": "Corrosion protection."
    },
    {
        "id": "vacuum-pump-oil",
        "name": "VACUUM PUMP OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Vacuum+Pump+Oil",
        "usages": ["Vacuum systems", "Pharma, chemicals, packaging"],
        "features": ["Low vapor pressure", "Clean operation"],
        "purpose": "Lubrication for vacuum pumps."
    },
    {
        "id": "cement-mill-oil",
        "name": "CEMENT MILL & KILN OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Cement+Mill+Oil",
        "usages": ["Open gears, kilns", "Cement & mining"],
        "packing": ["Barrels", "Bulk"],
        "purpose": "Lubrication for heavy cement machinery."
    },
    {
        "id": "open-gear-lubricant",
        "name": "OPEN GEAR & WIRE ROPE LUBRICANT",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Open+Gear+Lube",
        "usages": ["Cranes, open gears", "Ports, mining, steel"],
        "features": ["Form: Oil / Grease"],
        "purpose": "Exposed gear and rope lubrication."
    },
    {
        "id": "food-grade-lubricants",
        "name": "FOOD GRADE LUBRICANTS (NSF H1)",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Food+Grade+Lube",
        "usages": ["Accidental food contact zones", "Food & beverage, pharma"],
        "sub_products": ["Hydraulic oil", "Grease", "Chain oil"],
        "purpose": "Safe lubricants for food processing."
    },
    {
        "id": "chain-oil",
        "name": "CHAIN OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Chain+Oil",
        "usages": ["Conveyors & chains", "Packaging, textile, FMCG"],
        "features": ["Anti-wear", "Anti-drip"],
        "purpose": "Lubrication for industrial chains."
    },
    {
        "id": "mould-release-oil",
        "name": "MOULD RELEASE OIL",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Mould+Release+Oil",
        "usages": ["Rubber, plastic, concrete"],
        "packing": ["Drums", "Sprays"],
        "purpose": "Easy demoulding agent."
    },
    {
        "id": "process-oils", # Renaming/Updating overlap with Specialty Oils if needed, but 'products' above had separate entry. I'll keep separate.
        "name": "PROCESS OILS (AROMATIC / PARAFFINIC)",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Process+Oils",
        "usages": ["Plastic & rubber processing", "Tyre, polymer"],
        "packing": ["Barrels", "IBC"],
        "purpose": "Processing aids for rubber and polymers."
    },
    {
        "id": "demulsifying-oils",
        "name": "DEMULSIFYING & EMULSIFYING OILS",
        "category": "Oil & Lubricants",
        "image": "https://placehold.co/600x400?text=Emulsifying+Oil",
        "usages": ["Metalworking fluids", "Machining, CNC shops"],
        "purpose": "Fluid separation and emulsion."
    }
]

# Append new
for np in new_products:
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

print("Oil & Lubricants products added/updated successfully.")
