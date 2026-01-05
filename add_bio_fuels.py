import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

new_bio_products = [
    {
        "id": "biomass-briquettes-90mm",
        "name": "90mm Biomass Briquettes",
        "category": "Bio Fuels",
        "image": "/images/products/biomass-briquettes-90mm.jpg",
        "purpose": "High-density 90mm biomass briquettes for industrial heating and power generation.",
        "features": ["Diameter 90mm, Length 200\u2013300mm", "Calorific Value 4200\u20134500 kcal/kg"],
        "usages": ["Industrial boilers", "Steam generation", "Power plants"]
    },
    {
        "id": "biomass-briquettes-70mm",
        "name": "70mm Biomass Briquettes",
        "category": "Bio Fuels",
        "image": "/images/products/biomass-briquettes-70mm.jpg",
        "purpose": "Cost-effective fuel alternative for industrial thermal needs.",
        "features": ["Diameter 70mm, Length 200\u2013300mm", "Low ash"],
        "usages": ["Boilers", "Furnaces", "Drying units"]
    },
    {
        "id": "biomass-briquettes-6mm",
        "name": "6mm Biomass Briquettes",
        "category": "Bio Fuels",
        "image": "/images/products/6mm-biomass-briquettes.jpeg",
        "purpose": "Small-diameter briquettes for automated feeding systems.",
        "features": ["Diameter 6mm", "Low moisture", "High density"],
        "usages": ["Automatic boilers", "Small industries"]
    },
    {
        "id": "biomass-briquettes-8mm",
        "name": "8mm Biomass Briquettes",
        "category": "Bio Fuels",
        "image": "/images/products/8mm-biomass-briquettes.jpeg",
        "purpose": "Compact biomass fuel with consistent combustion.",
        "features": ["Diameter 8mm", "Low ash content"],
        "usages": ["Heating systems", "Agro-industries"]
    },
    {
        "id": "coconut-shell-charcoal-pillow",
        "name": "Coconut Shell Charcoal \u2013 Pillow",
        "category": "Bio Fuels",
        "image": "/images/products/pillow-charcoal.jpeg",
        "purpose": "Premium pillow-shaped charcoal from coconut shells.",
        "features": ["High fixed carbon", "Low ash"],
        "usages": ["BBQ", "Shisha", "Restaurants"]
    },
    {
        "id": "coconut-shell-charcoal-pillow-standard",
        "name": "Coconut Shell Charcoal \u2013 Pillow (Standard)",
        "category": "Bio Fuels",
        "image": "/images/products/pillow-standard.jpeg",
        "purpose": "Standard-grade pillow charcoal for bulk usage.",
        "features": ["Consistent size", "Long burning"],
        "usages": ["Commercial grilling"]
    },
    {
        "id": "coconut-shell-charcoal-hexagonal",
        "name": "Coconut Shell Charcoal \u2013 Hexagonal",
        "category": "Bio Fuels",
        "image": "/images/products/hexagonal-charcoal.jpeg",
        "purpose": "Hexagonal charcoal with hole for better airflow.",
        "features": ["Uniform shape", "High heat output"],
        "usages": ["BBQ", "Shisha"]
    },
    {
        "id": "cocopeat-premium-5kg",
        "name": "Cocopeat Premium 5kg Block",
        "category": "Bio Fuels",
        "image": "/images/products/cocopeat-premium-5kg.jpg",
        "purpose": "Washed and buffered cocopeat for horticulture.",
        "features": ["pH 6\u20136.5", "Low EC"],
        "usages": ["Nurseries", "Greenhouses"]
    },
    {
        "id": "cocopeat-low-ec-5kg",
        "name": "Cocopeat Low EC 5kg Block",
        "category": "Bio Fuels",
        "image": "/images/products/cocopeat-low-ec-5kg.jpg",
        "purpose": "Ultra-low EC cocopeat for sensitive crops.",
        "features": ["EC < 0.5 mS/cm"],
        "usages": ["Hydroponics", "Seed germination"]
    },
    {
        "id": "cocopeat-high-ec-5kg",
        "name": "Cocopeat High EC 5kg Block",
        "category": "Bio Fuels",
        "image": "/images/products/cocopeat-high-ec-5kg.jpg",
        "purpose": "Economical cocopeat for general farming.",
        "features": ["Higher EC range"],
        "usages": ["Open-field cultivation"]
    },
    {
        "id": "coco-husk-block",
        "name": "Coco Husk Block",
        "category": "Bio Fuels",
        "image": "/images/products/coco-husk-block.jpeg",
        "purpose": "Compressed coconut husk blocks for soil aeration.",
        "features": ["High water retention"],
        "usages": ["Landscaping", "Mulching"]
    },
    {
        "id": "indonesian-coal-bulk",
        "name": "Indonesian Coal (Bulk)",
        "category": "Bio Fuels",
        "image": "/images/products/indonesian-coal-bulk.jpeg",
        "purpose": "High-quality Indonesian thermal coal in bulk.",
        "features": ["High GCV", "Low ash"],
        "usages": ["Power plants", "Cement plants"]
    },
    {
        "id": "indonesian-coal-crushed",
        "name": "Indonesian Coal (Crushed)",
        "category": "Bio Fuels",
        "image": "/images/products/indonesian-coal-crushed.jpeg",
        "purpose": "Crushed Indonesian coal for industrial use.",
        "features": ["Controlled size", "Stable combustion"],
        "usages": ["Boilers", "Kilns"]
    },
    {
        "id": "mine-coal",
        "name": "Mine Coal",
        "category": "Bio Fuels",
        "image": "/images/products/mine-coal.jpeg",
        "purpose": "Domestic mine coal for heavy industries.",
        "features": ["Medium ash", "Good calorific value"],
        "usages": ["Steel", "Brick kilns"]
    },
    {
        "id": "pet-coke",
        "name": "Pet Coke",
        "category": "Bio Fuels",
        "image": "/images/products/pet-coke.jpeg",
        "purpose": "High-carbon petroleum coke fuel.",
        "features": ["Very high calorific value"],
        "usages": ["Cement plants", "Power generation"]
    },
    {
        "id": "met-coke",
        "name": "Met Coke",
        "category": "Bio Fuels",
        "image": "/images/products/met-coke.jpeg",
        "purpose": "Metallurgical coke for steel production.",
        "features": ["High strength", "Low moisture"],
        "usages": ["Blast furnaces"]
    },
    {
        "id": "activated-carbon",
        "name": "Activated Carbon",
        "category": "Bio Fuels",
        "image": "/images/products/activated-carbon.jpeg",
        "purpose": "High adsorption activated carbon.",
        "features": ["High surface area"],
        "usages": ["Water purification", "Air filtration"]
    },
    {
        "id": "bio-charcoal",
        "name": "Bio Charcoal",
        "category": "Bio Fuels",
        "image": "/images/products/bio-charcoal.jpeg",
        "purpose": "Eco-friendly bio charcoal from biomass.",
        "features": ["Low emissions"],
        "usages": ["Cooking", "Heating"]
    },
    {
        "id": "starter-cube",
        "name": "Starter Cube",
        "category": "Bio Fuels",
        "image": "/images/products/starter-cube.jpeg",
        "purpose": "Quick-ignition fire starter cubes.",
        "features": ["Odorless", "Long burn time"],
        "usages": ["BBQ", "Fireplaces"]
    },
    {
        "id": "sheesha-coal",
        "name": "Sheesha Coal",
        "category": "Bio Fuels",
        "image": "/images/products/sheesha-coal.jpeg",
        "purpose": "Smokeless charcoal specially made for sheesha.",
        "features": ["Long-lasting heat"],
        "usages": ["Hookah / sheesha"]
    },
    {
        "id": "magic-coal",
        "name": "Magic Coal",
        "category": "Bio Fuels",
        "image": "/images/products/magic-coal.jpeg",
        "purpose": "Easy-light charcoal with consistent performance.",
        "features": ["Uniform shape"],
        "usages": ["BBQ", "Home use"]
    },
    {
        "id": "wood-coal",
        "name": "Wood Coal",
        "category": "Bio Fuels",
        "image": "/images/products/wood-coal.jpeg",
        "purpose": "Traditional wood-based charcoal.",
        "features": ["Natural carbon content"],
        "usages": ["Cooking", "Heating"]
    }
]

# Append new products (checking for duplicates)
for np in new_bio_products:
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

print("Bio Fuels products added successfully.")
