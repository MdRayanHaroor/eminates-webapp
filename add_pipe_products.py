import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# Define new products
new_products = [
    {
        "id": "upvc-pipe",
        "name": "uPVC PIPE & FITTINGS",
        "category": "Pipes & Fittings",
        "image": [
            "/images/products/upvc_pipe_stock.png",
            "/images/products/upvc_fittings.png",
            "/images/products/upvc_installation.png",
            "/images/products/upvc_system.png"
        ],
        "purpose": "Rigid, chemically resistant piping for industrial and residential use.",
        "material": "Unplasticized Polyvinyl Chloride (uPVC)",
        "features": [
            "Corrosion & chemical resistant",
            "Lightweight, long life",
            "Smooth inner surface (low friction)"
        ],
        "usages": [
            "Water supply lines",
            "Plumbing & drainage",
            "Chemical handling (mild chemicals)",
            "Agriculture & irrigation"
        ],
        "packing": {
            "bulk": "Bundles / pallets",
            "small": "Individual pipes & fittings (elbow, tee, coupling)"
        },
        "solutions": [
            "Supply & trading",
            "Plumbing system solutions",
            "Project-based bulk supply"
        ]
    },
    {
        "id": "pvc-pipe",
        "name": "PVC PIPE & FITTINGS",
        "category": "Pipes & Fittings",
        "image": [
            "/images/products/pvc_pipe_stock.png",
            "/images/products/pvc_fittings.png",
            "/images/products/pvc_installation.png",
            "/images/products/pvc_system.png"
        ],
        "purpose": "Economical and versatile piping for drainage and domestic plumbing.",
        "material": "Polyvinyl Chloride (PVC)",
        "features": [
            "Economical",
            "Easy installation",
            "Leak-proof joints"
        ],
        "usages": [
            "Domestic plumbing",
            "Drainage & sewage",
            "Cable conduit"
        ],
        "packing": {
            "bulk": "Pipe bundles",
            "small": "Retail pipe lengths & fittings"
        },
        "solutions": [
            "Residential & commercial supply",
            "Drainage system solutions"
        ]
    },
    {
        "id": "cpvc-pipe",
        "name": "CPVC PIPE & FITTINGS",
        "category": "Pipes & Fittings",
        "image": [
            "/images/products/cpvc_pipe_stock.png",
            "/images/products/cpvc_fittings.png",
            "https://placehold.co/800x600?text=CPVC+Installation",
            "https://placehold.co/800x600?text=CPVC+System"
        ],
        "purpose": "Heat resistant piping specially designed for hot and cold water systems.",
        "material": "Chlorinated Polyvinyl Chloride (CPVC)",
        "features": [
            "High temperature resistance",
            "Suitable for hot & cold water",
            "Long service life"
        ],
        "usages": [
            "Hot & cold water plumbing",
            "Residential & hotel projects",
            "Hospitals"
        ],
        "packing": {
            "bulk": "Project supply",
            "small": "3m / 6m pipes & fittings"
        },
        "solutions": [
            "Hot water plumbing solutions",
            "Turnkey plumbing material supply"
        ]
    },
    {
        "id": "hdpe-pipe",
        "name": "HDPE PIPE & FITTINGS",
        "category": "Pipes & Fittings",
        "image": [
            "https://placehold.co/800x600?text=HDPE+Stock",
            "https://placehold.co/800x600?text=HDPE+Fittings",
            "https://placehold.co/800x600?text=HDPE+Installation",
            "https://placehold.co/800x600?text=HDPE+System"
        ],
        "purpose": "Heavy-duty, flexible piping for high pressure and underground applications.",
        "material": "High Density Polyethylene (HDPE)",
        "features": [
            "High pressure rating",
            "Flexible & impact resistant",
            "Fusion joint = zero leakage"
        ],
        "usages": [
            "Water pipelines",
            "Industrial chemical lines",
            "Gas pipelines",
            "Sewage & drainage"
        ],
        "packing": {
            "bulk": "Coils / straight lengths",
            "small": "HDPE fittings & accessories"
        },
        "solutions": [
            "Fusion welding support",
            "Large-scale pipeline projects"
        ]
    },
    {
        "id": "ms-pipe",
        "name": "MS PIPE & FITTINGS (MILD STEEL)",
        "category": "Pipes & Fittings",
        "image": [
            "https://placehold.co/800x600?text=MS+Pipe+Stock",
            "https://placehold.co/800x600?text=MS+Fittings",
            "https://placehold.co/800x600?text=MS+Installation",
            "https://placehold.co/800x600?text=MS+System"
        ],
        "purpose": "Strong and durable steel pipes for structural and industrial use.",
        "material": "Mild Steel (MS)",
        "features": [
            "High strength",
            "Cost-effective",
            "Weldable"
        ],
        "usages": [
            "Industrial pipelines",
            "Structural works",
            "Fire fighting systems"
        ],
        "packing": {
            "bulk": "Lengths / bundles",
            "small": "Elbows, tees, flanges"
        },
        "solutions": [
            "Industrial piping solutions",
            "Fabrication & supply"
        ]
    },
    {
        "id": "ss-pipe",
        "name": "SS PIPE & FITTINGS (STAINLESS STEEL)",
        "category": "Pipes & Fittings",
        "image": [
            "https://placehold.co/800x600?text=SS+Pipe+Stock",
            "https://placehold.co/800x600?text=SS+Fittings",
            "https://placehold.co/800x600?text=SS+Installation",
            "https://placehold.co/800x600?text=SS+System"
        ],
        "purpose": "Corrosion resistant and hygienic pipes for sensitive industries.",
        "material": "Stainless Steel (SS 304 / 316)",
        "features": [
            "Corrosion resistant",
            "Hygienic",
            "Long lifespan"
        ],
        "usages": [
            "Chemical & pharma plants",
            "Food & beverage industry",
            "High-pressure systems"
        ],
        "packing": {
            "bulk": "Wooden crate / bundle",
            "small": "Precision fittings"
        },
        "solutions": [
            "Hygienic piping systems",
            "Chemical plant supply"
        ]
    },
    {
        "id": "gi-pipe",
        "name": "GI PIPE & FITTINGS",
        "category": "Pipes & Fittings",
        "image": [
            "https://placehold.co/800x600?text=GI+Pipe+Stock",
            "https://placehold.co/800x600?text=GI+Fittings",
            "https://placehold.co/800x600?text=GI+Installation",
            "https://placehold.co/800x600?text=GI+System"
        ],
        "purpose": "Rust-resistant galvanized pipes for outdoor and water supply lines.",
        "material": "Galvanized Iron (GI)",
        "features": [
            "Rust resistant coating",
            "Durable",
            "Suitable for outdoor use"
        ],
        "usages": [
            "Water supply",
            "Fire fighting pipelines",
            "Structural use"
        ],
        "packing": {
            "bulk": "Bundles",
            "small": "GI fittings & couplings"
        },
        "solutions": [
            "N/A"
        ]
    },
    {
        "id": "ppr-pipe",
        "name": "PPR PIPE & FITTINGS",
        "category": "Pipes & Fittings",
        "image": [
            "https://placehold.co/800x600?text=PPR+Pipe+Stock",
            "https://placehold.co/800x600?text=PPR+Fittings",
            "https://placehold.co/800x600?text=PPR+Installation",
            "https://placehold.co/800x600?text=PPR+System"
        ],
        "purpose": "Fusion-welded pipes for reliable hot and cold water transport.",
        "material": "Polypropylene Random Copolymer (PPR)",
        "features": [
            "Heat resistant",
            "Fusion welded joints",
            "Long life"
        ],
        "usages": [
            "Hot & cold water systems",
            "Industrial plumbing"
        ],
        "packing": {
             "bulk": "PPR pipe coils/bundles",
             "small": "PPR fittings"
        },
        "solutions": [
            "N/A"
        ]
    }
]

# Append new products (checking for dupes by ID)
existing_ids = {p['id'] for p in products}
for np in new_products:
    if np['id'] in existing_ids:
        # Update existing
        for i, p in enumerate(products):
            if p['id'] == np['id']:
                products[i] = np
                break
    else:
        products.append(np)

# Sort logic - optional, but keeping it consistent might be good. 
# Let's just append for now as sorting by category/name might mix things up too much if not careful.
# But I will sort the whole list by category then name to keep it clean.
# Grouping...
grouped = {}
for p in products:
    cat = p.get('category', 'Uncategorized')
    if cat not in grouped:
        grouped[cat] = []
    grouped[cat].append(p)

sorted_products = []
# Define a custom category order if needed, otherwise alphabetical
custom_order = ['Chemicals', 'Lubricants', 'Mechanical', 'Real-estate & construction', 'Gypsum', 'Pipes & Fittings']
# Check for any categories not in custom order
other_cats = [c for c in grouped.keys() if c not in custom_order]
final_order = custom_order + sorted(other_cats)

for cat in final_order:
    if cat in grouped:
        # Sort items within category by name
        grouped[cat].sort(key=lambda x: x['name'].lower())
        sorted_products.extend(grouped[cat])

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(sorted_products, f, indent=4)

print("Pipe products added successfully.")
