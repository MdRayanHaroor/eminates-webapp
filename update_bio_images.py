import json

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# Mapping Name (or close to it) -> New Image Path
# Using ID for safer mapping where obvious, Name where ambiguous but clear from context
image_updates = {
    "biomass-briquettes-90mm": "/images/products/biomass-briquettes-90mm.jpg",
    "biomass-briquettes-70mm": "/images/products/biomass-briquettes-70mm-1.jpeg",
    "biomass-briquettes-6mm": "/images/products/biomass-briquettes-6mm-1.jpeg",
    "biomass-briquettes-8mm": "/images/products/biomass-briquettes-8mm-1.jpeg",
    "coconut-shell-charcoal-pillow": "/images/products/coconut-shell-charcoal-pillow-1.jpeg",
    "coconut-shell-charcoal-pillow-standard": "/images/products/coconut-shell-charcoal-pillow-standard-1.jpeg",
    "coconut-shell-charcoal-hexagonal": "/images/products/coconut-shell-charcoal-hexagonal-1.jpeg",
    "cocopeat-premium-5kg": "/images/products/cocopeat-premium-5kg-new-1.jpeg",
    "cocopeat-low-ec-5kg": "/images/products/cocopeat-low-ec-5kg-1.jpeg",
    "cocopeat-high-ec-5kg": "/images/products/cocopeat-high-ec-5kg-1.jpeg",
    "coco-husk-block": "/images/products/coco-husk-block-1.jpeg",
    "indonesian-coal-bulk": "/images/products/indonesian-coal-bulk-1.jpeg",
    "indonesian-coal-crushed": "/images/products/indonesian-coal-crushed-1.jpeg",
    "mine-coal": "/images/products/mine-coal-1.jpeg",
    "pet-coke": "/images/products/pet-coke-1.jpeg",
    "met-coke": "/images/products/met-coke-1.jpeg",
    "activated-carbon": "/images/products/activated-carbon-1.jpeg",
    "bio-charcoal": "/images/products/Bio-Char-1.jpeg",
    "starter-cube": "/images/products/starter-cube-1.jpeg",
    "sheesha-coal": "/images/products/magic-coal-1.jpeg", # Swapped as per user request
    "magic-coal": "/images/products/sheesha-coal-1.jpeg", # Swapped as per user request
    "wood-coal": "/images/products/wood-coal-1.jpeg"
}

updated_count = 0
for p in products:
    if p['id'] in image_updates:
        p['image'] = image_updates[p['id']]
        updated_count += 1

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4)

print(f"Updated images for {updated_count} products.")
