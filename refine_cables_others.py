import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# 1. Remove generic 'industrial-cables'
products = [p for p in products if p['id'] != "industrial-cables"]

# 2. Add 5 specific cable products
new_cables = [
    {
        "id": "power-cables",
        "name": "POWER CABLES (LT / HT)",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Armoured+Cable+Drum",
            "https://placehold.co/600x400?text=Cable+Laying",
            "https://placehold.co/600x400?text=LT+Power+Cable",
            "https://placehold.co/600x400?text=HT+Power+Cable"
        ],
        "purpose": "Transmit electrical power safely from source to equipment, panels, and substations.",
        "sub_products": ["LT Power Cables (1.1 kV)", "HT Power Cables (11 kV / 22 kV / 33 kV)", "Armoured & Unarmoured"],
        "usages": ["Factories & manufacturing plants", "Substations & power plants", "Heavy machinery & motors"],
        "features": ["Copper / Aluminium Conductor", "PVC / XLPE Insulation"]
    },
    {
        "id": "control-cables",
        "name": "CONTROL CABLES",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Multicore+Cable",
            "https://placehold.co/600x400?text=Control+Panel+Wiring",
            "https://placehold.co/600x400?text=Cable+Trays",
            "https://placehold.co/600x400?text=Control+Signal+Cable"
        ],
        "purpose": "Carry control signals between panels, PLCs, motors, and instruments.",
        "sub_products": ["Multi-core (2C to 61C)", "Copper conductor", "PVC / XLPE insulation"],
        "usages": ["PLC & automation panels", "MCC & PCC panels", "Process control systems"]
    },
    {
        "id": "instrumentation-cables",
        "name": "INSTRUMENTATION CABLES",
        "category": "Electric & Electronics",
        "image": [
             "https://placehold.co/600x400?text=Shielded+Cable",
             "https://placehold.co/600x400?text=Data+Transmission+Cable",
             "https://placehold.co/600x400?text=Instrumentation+Wiring",
             "https://placehold.co/600x400?text=Low+Noise+Cable"
        ],
        "purpose": "Used for low-signal, high-accuracy data transmission from sensors and instruments.",
        "features": ["Shielded / armoured", "Low noise & interference", "High accuracy signal transmission"],
        "usages": ["Chemical plants", "Oil & gas refineries", "SCADA & DCS systems"]
    },
    {
        "id": "flexible-cables",
        "name": "FLEXIBLE CABLES",
        "category": "Electric & Electronics",
        "image": [
             "https://placehold.co/600x400?text=Flexible+Cable",
             "https://placehold.co/600x400?text=Portable+Equipment+Cable",
             "https://placehold.co/600x400?text=Moving+Machine+Cable",
             "https://placehold.co/600x400?text=Flex+Wire"
        ],
        "purpose": "Flexible wiring for moving machinery and portable equipment.",
        "usages": ["Moving machinery", "Portable equipment", "Temporary power connections"]
    },
    {
        "id": "earthing-cables",
        "name": "EARTHING & GROUNDING CABLES",
        "category": "Electric & Electronics",
        "image": [
             "https://placehold.co/600x400?text=Earthing+Strip",
             "https://placehold.co/600x400?text=Grounding+Cable",
             "https://placehold.co/600x400?text=Safety+Earth+Wire",
             "https://placehold.co/600x400?text=Green+Yellow+Cable"
        ],
        "purpose": "Essential for electrical safety and equipment grounding.",
        "usages": ["Electrical safety", "Shock protection", "Equipment grounding"]
    }
]

# 3. Add new Cable Trays
new_other = [
    {
        "id": "cable-trays",
        "name": "CABLE TRAYS & ACCESSORIES",
        "category": "Electric & Electronics",
        "image": [
             "https://placehold.co/600x400?text=Ladder+Tray",
             "https://placehold.co/600x400?text=Perforated+Tray",
             "https://placehold.co/600x400?text=Cable+Raceway",
             "https://placehold.co/600x400?text=Cable+Management"
        ],
        "purpose": "Systems for organized routing and support of electrical cables.",
        "sub_products": ["Ladder tray", "Perforated tray", "Raceway systems"],
        "usages": ["Cable management", "Power & control routing"]
    }
]

# 4. Updates to existing products
updates = {
    "mcb": {
        "usages": ["Lighting circuits", "Control panels", "Commercial & industrial DBs"]
    },
    "mccb": {
         "usages": ["Motor protection", "Main incomer panels", "Heavy electrical loads"]
    },
    "industrial-lighting": { # Previously 'LED LIGHT FITTINGS – INDUSTRIAL'
        "sub_products": ["LED High Bay", "Flood Lights", "Street Lights", "Explosion-proof lights"],
        "usages": ["Warehouses", "Plants & yards", "Oil & gas zones"]
    },
    "switchgear-panels": {
         "sub_products": ["LT Panels", "MCC Panels", "PCC Panels", "Control Panels"]
    }
}

# Apply updates
for p in products:
    if p['id'] in updates:
        p.update(updates[p['id']])

# Append new
for item in new_cables + new_other:
    products.append(item)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4)

print("Refined Cables & Others successfully.")
