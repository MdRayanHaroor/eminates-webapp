import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# Image Sets
# Note: Paths are relative to public root, so they start with /images/...
img_liquid = [
    "/images/products/liquid_small.png",
    "/images/products/liquid_bulk.png",
    "/images/products/chemical_plant.png"
]

img_powder = [
    "/images/products/powder_small.png",
    "/images/products/powder_bulk.png",
    "/images/products/chemical_plant.png"
]

# Classification based on ID or Name keywords
liquid_ids = [
    "sulphuric-acid", "ferric-chloride", "hydrogen-peroxide", "acetic-acid", 
    "caustic-lye", "hcl", "nitric-acid", "sodium-hypo", "antiscalants", "defoamers"
]

# Everything else in chemicals typically powder/solid in this context, 
# or explicit checks.
powder_ids = [
    "sodium-bisulphite", "bleaching-powder", "ferric-alum", "edta-salts", "edta",
    "hydrated-lime", "caustic-soda-flakes", "pac", "polyelectrolytes", 
    "sls", "sodium-metabisulphite"
]

# Update logic
for p in products:
    if p.get('category') == 'Chemicals':
        pid = p.get('id')
        if pid in liquid_ids:
            p['image'] = img_liquid
        elif pid in powder_ids:
            p['image'] = img_powder
        else:
            # Fallback or leave as is? 
            # If we missed one, let's guess based on name?
            # For now, if it's not in the list, we might leave it or assign powder as default?
            # Let's check keywords
            name_lower = p.get('name', '').lower()
            if 'acid' in name_lower or 'liquid' in name_lower or 'solution' in name_lower:
                p['image'] = img_liquid
            else:
                p['image'] = img_powder

# Sort logic
# Group by category first to keep them together if needed, or just sort the whole list by category then name?
# Usually keeping category blocks together is nice.

grouped = {}
categories_order = []  # Maintain order of appearance of categories

for p in products:
    cat = p.get('category', 'Uncategorized')
    if cat not in grouped:
        grouped[cat] = []
        categories_order.append(cat)
    grouped[cat].append(p)

sorted_products = []
for cat in categories_order:
    # Sort by name, case insensitive
    grouped[cat].sort(key=lambda x: x['name'].lower())
    sorted_products.extend(grouped[cat])

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(sorted_products, f, indent=4)

print("Product details updated with images and sorted successfully.")
