import json

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

new_products = [
    {
        "id": "sulphuric-acid",
        "name": "Sulphuric Acid",
        "category": "Chemicals",
        "image": [
            "https://placehold.co/600x400?text=Sulphuric+Acid+Small+Packing",
            "https://placehold.co/600x400?text=Sulphuric+Acid+Bulk+Packing",
            "https://placehold.co/600x400?text=Sulphuric+Acid+Plant"
        ],
        "purpose": "A strong mineral acid widely used in industrial processing and fertilizer production.",
        "usages": [
            "Fertilizer manufacturing",
            "Chemical synthesis",
            "Wastewater treatment",
            "Oil refining",
            "Metal processing"
        ]
    },
    {
        "id": "sodium-bisulphite",
        "name": "Sodium Bisulphite",
        "category": "Chemicals",
        "image": [
            "https://placehold.co/600x400?text=Sodium+Bisulphite+Small+Packing",
            "https://placehold.co/600x400?text=Sodium+Bisulphite+Bulk+Packing",
            "https://placehold.co/600x400?text=Sodium+Bisulphite+Plant"
        ],
        "purpose": "A versatile chemical used as a reducing agent and preservative.",
        "usages": [
            "Dechlorination in water treatment",
            "Food preservative",
            "Textile bleaching",
            "Photography",
            "Leather tanning"
        ]
    },
    {
        "id": "bleaching-powder",
        "name": "Calcium Hypochlorite (Bleaching Powder)",
        "category": "Chemicals",
        "image": [
            "https://placehold.co/600x400?text=Bleaching+Powder+Small+Packing",
            "https://placehold.co/600x400?text=Bleaching+Powder+Bulk+Packing",
            "https://placehold.co/600x400?text=Bleaching+Powder+Plant"
        ],
        "purpose": "A widely used disinfectant and bleaching agent for water and textiles.",
        "usages": [
            "Water disinfection",
            "Swimming pool sanitization",
            "Textile bleaching",
            "Sewage treatment",
            "Moss and algae removal"
        ]
    },
    {
        "id": "ferric-chloride",
        "name": "Ferric Chloride",
        "category": "Chemicals",
        "image": [
            "https://placehold.co/600x400?text=Ferric+Chloride+Small+Packing",
            "https://placehold.co/600x400?text=Ferric+Chloride+Bulk+Packing",
            "https://placehold.co/600x400?text=Ferric+Chloride+Plant"
        ],
        "purpose": "An industrial coagulant and etchant used in water treatment and electronics.",
        "usages": [
            "Sewage treatment",
            "Drinking water production",
            "Etching copper PCBs",
            "Odor control",
            "Sludge dewatering"
        ]
    },
    {
        "id": "ferric-alum",
        "name": "Ferric Alum",
        "category": "Chemicals",
        "image": [
            "https://placehold.co/600x400?text=Ferric+Alum+Small+Packing",
            "https://placehold.co/600x400?text=Ferric+Alum+Bulk+Packing",
            "https://placehold.co/600x400?text=Ferric+Alum+Plant"
        ],
        "purpose": "A chemical coagulant effective for water purification and paper sizing.",
        "usages": [
            "Water purification",
            "Paper sizing",
            "Tanning leather",
            "Mordant in dyeing",
            "Effluent treatment"
        ]
    },
    {
        "id": "edta-salts",
        "name": "EDTA Tetra & Di Sodium Salt",
        "category": "Chemicals",
        "image": [
            "https://placehold.co/600x400?text=EDTA+Salts+Small+Packing",
            "https://placehold.co/600x400?text=EDTA+Salts+Bulk+Packing",
            "https://placehold.co/600x400?text=EDTA+Salts+Plant"
        ],
        "purpose": "Chelating agent salts used for sequestering metal ions in various industries.",
        "usages": [
            "Detergents and soaps",
            "Textile industry",
            "Paper pulp bleaching",
            "Water softening",
            "Agriculture micronutrients"
        ]
    },
    {
        "id": "hydrogen-peroxide",
        "name": "Hydrogen Peroxide",
        "category": "Chemicals",
        "image": [
            "https://placehold.co/600x400?text=Hydrogen+Peroxide+Small+Packing",
            "https://placehold.co/600x400?text=Hydrogen+Peroxide+Bulk+Packing",
            "https://placehold.co/600x400?text=Hydrogen+Peroxide+Plant"
        ],
        "purpose": "A strong oxidizer and bleaching agent with diverse industrial applications.",
        "usages": [
            "Paper bleaching",
            "Textile bleaching",
            "Wastewater treatment",
            "Disinfection",
            "Chemical synthesis"
        ]
    },
    {
        "id": "acetic-acid",
        "name": "Acetic Acid",
        "category": "Chemicals",
        "image": [
            "https://placehold.co/600x400?text=Acetic+Acid+Small+Packing",
            "https://placehold.co/600x400?text=Acetic+Acid+Bulk+Packing",
            "https://placehold.co/600x400?text=Acetic+Acid+Plant"
        ],
        "purpose": "An organic acid serving as a key building block for chemicals and food additives.",
        "usages": [
            "Vinyl acetate monomer production",
            "Ester production",
            "Textile industry",
            "Food additive",
            "Solvent"
        ]
    },
    {
        "id": "hydrated-lime",
        "name": "Hydrated Lime Powder",
        "category": "Chemicals",
        "image": [
            "https://placehold.co/600x400?text=Hydrated+Lime+Small+Packing",
            "https://placehold.co/600x400?text=Hydrated+Lime+Bulk+Packing",
            "https://placehold.co/600x400?text=Hydrated+Lime+Plant"
        ],
        "purpose": "A dry powder used extensively in water treatment and construction.",
        "usages": [
            "Water treatment (pH adjustment)",
            "Sugar refining",
            "Construction (mortar)",
            "Flue gas desulfurization",
            "Leather industry"
        ]
    }
]

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# Merge existing and new
products.extend(new_products)

# Organize by category
categories_order = []
grouped_products = {}

for p in products:
    cat = p.get('category', 'Uncategorized')
    if cat not in grouped_products:
        categories_order.append(cat)
        grouped_products[cat] = []
    grouped_products[cat].append(p)

sorted_products = []
for cat in categories_order:
    # Sort by name, case insensitive
    items = grouped_products[cat]
    items.sort(key=lambda x: x['name'].lower())
    sorted_products.extend(items)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(sorted_products, f, indent=4)

print("Product details updated and sorted successfully.")
