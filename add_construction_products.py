import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

new_construction_products = [
    {
        "id": "tmt-bars",
        "name": "TMT STEEL BARS / STEEL RODS",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=TMT+Steel+Bars",
        "features": ["Sizes: 8mm to 32mm", "Grades: Fe 500 / Fe 550 / Fe 600", "Standards: IS 1786"],
        "usages": ["RCC columns, beams & slabs", "Foundations & structural works", "High-rise & infrastructure projects"],
        "purpose": "Reinforcement for concrete structures."
    },
    {
        "id": "cement",
        "name": "CEMENT (ALL VARIANTS)",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Cement+Bags",
        "sub_products": ["OPC 43 / OPC 53", "PPC", "PSC"],
        "usages": ["Concrete & RCC", "Brick masonry", "Plastering & finishing"],
        "purpose": "Binding agent for construction."
    },
    {
        "id": "structural-steel",
        "name": "STRUCTURAL STEEL (MS)",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Structural+Steel",
        "sub_products": ["Beams (ISMB)", "Channels (ISMC)", "Angles, Flats, Plates"],
        "usages": ["Industrial sheds", "Warehouses", "Platforms & staircases"],
        "purpose": "Framework for industrial structures."
    },
    {
        "id": "sand-aggregates",
        "name": "SAND & AGGREGATES",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Sand+and+Aggregates",
        "sub_products": ["M-Sand", "River Sand", "Blue Metal (10mm / 20mm / 40mm)"],
        "usages": ["Concrete mixing", "Brick & block work", "Road construction"],
        "purpose": "Base materials for construction."
    },
    {
        "id": "bricks-blocks",
        "name": "BRICKS & BLOCKS",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Bricks+and+Blocks",
        "sub_products": ["Red clay bricks", "Hollow blocks", "AAC blocks"],
        "usages": ["Load-bearing walls", "Partition walls"],
        "purpose": "Building walls and structures."
    },
    {
        "id": "roofing-sheets",
        "name": "ROOFING SHEETS & CLADDING",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Roofing+Sheets",
        "sub_products": ["GI sheets", "Color-coated sheets", "Polycarbonate sheets", "Cement sheets"],
        "usages": ["Industrial sheds", "Warehouses", "Parking & shelters"],
        "purpose": "Roofing and wall cladding solutions."
    },
    {
        "id": "fasteners-construction",
        "name": "FASTENERS \u2013 SCREWS, BOLTS & ANCHORS",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Construction+Fasteners",
        "sub_products": ["Anchor bolts", "HT bolts", "Self-drilling screws"],
        "usages": ["Steel connections", "Roofing sheet fixing"],
        "purpose": "Fixing and joining construction elements."
    },
    {
        "id": "binding-wire",
        "name": "BINDING WIRE & WIRE MESH",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Binding+Wire",
        "usages": ["Tying reinforcement bars", "Slab & plaster support"],
        "purpose": "Securing steel reinforcements."
    },
    {
        "id": "shuttering-formwork",
        "name": "SHUTTERING & FORMWORK SYSTEMS",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Shuttering+and+Formwork",
        "sub_products": ["Shuttering plywood", "Steel plates", "Props & jacks"],
        "purpose": "Molds for concrete pouring."
    },
    {
        "id": "construction-chemicals",
        "name": "CONSTRUCTION CHEMICALS",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Construction+Chemicals",
        "sub_products": ["Tile adhesives", "Waterproofing compounds", "Admixtures"],
        "purpose": "Enhancing concrete and finishing properties."
    },
    {
        "id": "gypsum-interior", # Renaming/Updating potentially existing Gypsum
        "name": "GYPSUM & INTERIOR FINISHING",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Gypsum+and+Interiors",
        "sub_products": ["Gypsum powder", "POP", "Wall putty"],
        "purpose": "Interior wall and ceiling finishing."
    },
    {
        "id": "doors-plywood",
        "name": "DOORS, FRAMES & PLYWOOD",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Doors+and+Plywood",
        "usages": ["Interior finishing", "Commercial buildings"],
        "purpose": "Woodwork and entry solutions."
    },
    {
        "id": "paints-coatings",
        "name": "PAINTS & COATINGS",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Paints+and+Coatings",
        "sub_products": ["Interior & exterior paints", "Epoxy & PU coatings"],
        "purpose": "Aesthetics and surface protection."
    },
    {
        "id": "plumbing-drainage",
        "name": "PLUMBING & DRAINAGE MATERIALS",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Plumbing+Materials",
        "sub_products": ["uPVC / CPVC pipes", "Fittings & valves"],
        "purpose": "Water supply and waste management."
    },
    {
        "id": "electrical-conduits",
        "name": "ELECTRICAL CONDUITS & ACCESSORIES",
        "category": "Real-estate & construction",
        "image": "https://placehold.co/600x400?text=Electrical+Conduits",
        "usages": ["Concealed wiring", "Safety cable routing"],
        "purpose": "Protection and routing of electrical wires."
    }
]

# Append new products (checking for duplicates or updates)
# Special check for 'gypsum-powder' which might exist from previous tasks
for np in new_construction_products:
    found = False
    for i, p in enumerate(products):
        # Check by specific ID or if we want to merge into old 'gypsum-powder'
        if p['id'] == np['id'] or (np['id'] == 'gypsum-interior' and p['id'] == 'gypsum-powder'):
             # If we find old gypsum-powder, let's update it to the new broader definition but keep ID consistent if we wanted
             # BUT here I'll replace it with the new comprehensive entry, maybe keeping the new ID 'gypsum-interior' is cleaner
             # Let's overwrite fields. If ID mismatch (powder vs interior), I should probably remove the old one or just update it.
             # Given the scope, I will treat 'gypsum-powder' as the target for 'gypsum-interior' update if found.
             if p['id'] == 'gypsum-powder':
                 # Rename ID and update all fields
                 p['id'] = 'gypsum-interior'
                 p.update(np)
             else:
                 p.update(np)
             found = True
             break
    if not found:
        products.append(np)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4)

print("Real-estate & Construction products added successfully.")
