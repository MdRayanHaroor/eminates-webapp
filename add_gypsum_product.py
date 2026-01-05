import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

new_product = {
    "id": "gypsum-powder",
    "name": "Gypsum Powder",
    "category": "Gypsum",
    "image": [
        "/images/products/gypsum_bag_hd.png",
        "/images/products/gypsum_jumbo.png",
        "/images/products/gypsum_warehouse.png",
        "/images/products/gypsum_plastering.png",
        "/images/products/gypsum_ceiling.png",
        "/images/products/gypsum_interior.png"
    ],
    "purpose": "Premium quality gypsum powder for superior wall finishing, plastering, and false ceilings.",
    "usages": [
        "Wall plastering",
        "False ceiling manufacturing",
        "Construction finishing",
        "Ceramic mold making",
        "Soil conditioning"
    ]
}

# Remove existing if any (to avoid dupe)
products = [p for p in products if p['id'] != 'gypsum-powder']
products.append(new_product)

# Sort logic
grouped = {}
categories_order = []

# Collect categories in order of appearance (or custom order if we want, but simple appearance is fine)
# We might want "Gypsum" to appear in a specific place?
# The UI renders buttons based on `categories` array in JSX, which controls filter order.
# The data order mainly affects the "All" view or default sort.
# Let's just group and sort.

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

print("Gypsum product added and list sorted successfully.")
