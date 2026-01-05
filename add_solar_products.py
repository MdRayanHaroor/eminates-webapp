import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

new_solar_products = [
    {
        "id": "solar-epc",
        "name": "SOLAR EPC \u2013 ENGINEERING, PROCUREMENT & CONSTRUCTION",
        "category": "Solar",
        "image": [
            "https://placehold.co/600x400?text=Rooftop+Solar+Project",
            "https://placehold.co/600x400?text=Solar+Park+Installation",
            "https://placehold.co/600x400?text=EPC+Project+Site",
            "https://placehold.co/600x400?text=Solar+Panel+Array"
        ],
        "purpose": "End-to-end solar power projects including design, supply, installation, testing, commissioning, and handover.",
        "sub_products": [
             "Industrial rooftop solar",
             "Commercial solar plants",
             "Utility-scale solar parks",
             "Captive & open-access solar"
        ],
        "features": [
            "Rooftop: 5 kW to 5 MW",
            "Ground Mounted / Utility Scale: 1 MW to 50MW"
        ],
        "solutions": [
            "Design & Engineering",
            "Procurement & Supply",
            "Construction & Installation",
            "Commissioning & Handover"
        ],
        "usages": [
            "Manufacturing plants",
            "Warehouses & logistics parks",
            "Cement, steel & chemical industries",
            "Commercial buildings & institutions"
        ]
    },
    {
        "id": "solar-consulting",
        "name": "SOLAR CONSULTING & FEASIBILITY",
        "category": "Solar",
        "image": [
             "https://placehold.co/600x400?text=Solar+Site+Survey",
             "https://placehold.co/600x400?text=Feasibility+Report",
             "https://placehold.co/600x400?text=Shadow+Analysis",
             "https://placehold.co/600x400?text=Solar+ROI+Consulting"
        ],
        "purpose": "Expert consulting services for solar project feasibility and ROI analysis.",
        "solutions": [
             "Site survey & shadow analysis",
             "Feasibility study & ROI calculation",
             "Load assessment & system sizing",
             "Technology selection (Mono/Poly, Inverters)",
             "Regulatory & statutory guidance"
        ],
        "usages": [
            "Investors",
            "Industries",
            "Land owners",
            "EPC partners"
        ]
    },
    {
        "id": "solar-supply",
        "name": "SOLAR SYSTEM SUPPLY (MATERIAL)",
        "category": "Solar",
        "image": [
             "https://placehold.co/600x400?text=Solar+PV+Modules",
             "https://placehold.co/600x400?text=Solar+Inverter",
             "https://placehold.co/600x400?text=Mounting+Structure",
             "https://placehold.co/600x400?text=Solar+Cables"
        ],
        "purpose": "Supply of high-quality solar components and materials.",
        "sub_products": [
            "Solar PV modules (Mono / Bi-facial)",
            "String & central inverters",
            "Mounting structures (GI / aluminium)",
            "DC & AC solar cables",
            "Junction boxes & combiner panels"
        ],
        "features": [
            "Bulk project supply",
            "Individual component supply"
        ]
    },
    {
        "id": "solar-installation",
        "name": "SOLAR INSTALLATION & CONTRACTING",
        "category": "Solar",
        "image": [
             "https://placehold.co/600x400?text=Module+Mounting",
             "https://placehold.co/600x400?text=Solar+Installation+Team",
             "https://placehold.co/600x400?text=Civil+Foundation+Work",
             "https://placehold.co/600x400?text=Cabling+Work"
        ],
        "purpose": "Professional installation and contracting services for solar projects.",
        "solutions": [
            "Civil & foundation work",
            "Module mounting & alignment",
            "Electrical cabling & termination",
            "Inverter & panel installation",
            "Grid synchronization"
        ]
    },
    {
        "id": "solar-testing",
        "name": "TESTING, COMMISSIONING & GRID CONNECTIVITY",
        "category": "Solar",
        "image": [
             "https://placehold.co/600x400?text=Solar+Testing+Equipment",
             "https://placehold.co/600x400?text=Commissioning+Team",
             "https://placehold.co/600x400?text=Grid+Monitor",
             "https://placehold.co/600x400?text=Performance+Check"
        ],
        "purpose": "Ensuring system performance and grid connectivity compliance.",
        "solutions": [
            "System testing & inspection",
            "Inverter configuration",
            "SCADA & monitoring setup",
            "Utility grid approval & synchronization",
            "Performance verification"
        ]
    },
    {
        "id": "solar-om",
        "name": "OPERATION & MAINTENANCE (O&M)",
        "category": "Solar",
        "image": [
             "https://placehold.co/600x400?text=Solar+Cleaning",
             "https://placehold.co/600x400?text=Inverter+Maintenance",
             "https://placehold.co/600x400?text=O%26M+Services",
             "https://placehold.co/600x400?text=Solar+Monitoring"
        ],
        "purpose": "Comprehensive operation and maintenance services for optimal generation.",
        "solutions": [
            "Preventive & corrective maintenance",
            "Panel cleaning (manual / robotic)",
            "Inverter health checks",
            "Generation monitoring & reports",
            "Annual maintenance contracts (AMC)"
        ]
    }
]

# Append new products
for np in new_solar_products:
    # Check if exists (simple update or append)
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

print("Solar products added successfully.")
