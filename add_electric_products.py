import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# Define new products
new_products = [
    {
        "id": "switchgear-panels",
        "name": "SWITCHGEAR & POWER DISTRIBUTION (INDUSTRIAL)",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Switchgear+Panel",
            "https://placehold.co/600x400?text=LT+Panel+Distribution",
            "https://placehold.co/600x400?text=Industrial+Power+Control",
            "https://placehold.co/600x400?text=HT+Panel"
        ],
        "purpose": "Comprehensive power distribution solutions for industrial and commercial facilities.",
        "sub_products": [
            "LT Panels",
            "HT Panels",
            "Power Distribution Panels",
            "Control Panels"
        ],
        "usages": [
            "Factories & manufacturing units",
            "Power plants",
            "Commercial complexes",
            "Infrastructure projects"
        ],
        "features": [
            "Safe power distribution",
            "High fault protection",
            "Designed for continuous operation"
        ]
    },
    {
        "id": "circuit-protection",
        "name": "MCCB, MCB & ACB (CIRCUIT PROTECTION)",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=MCCB+Circuit+Breaker",
            "https://placehold.co/600x400?text=MCB+Safety+Switch",
            "https://placehold.co/600x400?text=Air+Circuit+Breaker",
            "https://placehold.co/600x400?text=Circuit+Protection"
        ],
        "purpose": "Essential circuit protection devices for safety and equipment longevity.",
        "sub_products": [
            "MCB (Miniature Circuit Breaker)",
            "MCCB (Molded Case Circuit Breaker)",
            "ACB (Air Circuit Breaker)"
        ],
        "usages": [
            "Motor protection",
            "Power control panels",
            "Electrical safety systems"
        ],
        "features": [
            "Overload protection",
            "Short circuit protection",
            "High breaking capacity"
        ]
    },
    {
        "id": "contactors-relays",
        "name": "CONTACTORS & RELAYS",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Industrial+Relay",
            "https://placehold.co/600x400?text=Contactor+Switch",
            "https://placehold.co/600x400?text=Motor+Control+Relay",
            "https://placehold.co/600x400?text=Automation+Contactor"
        ],
        "purpose": "Reliable switching components for automation and control circuits.",
        "sub_products": [
            "Power Contactors",
            "Control Relays",
            "Thermal Overload Relays"
        ],
        "usages": [
            "Motor control circuits",
            "Automation panels",
            "Conveyor & pump systems"
        ],
        "features": [
            "Reliable switching",
            "Long mechanical life",
            "Compact design"
        ]
    },
    {
        "id": "plc-systems",
        "name": "PLC - PROGRAMMABLE LOGIC CONTROLLER",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=PLC+Module",
            "https://placehold.co/600x400?text=Industrial+Automation+PLC",
            "https://placehold.co/600x400?text=PLC+Control+System",
            "https://placehold.co/600x400?text=Automation+Controller"
        ],
        "purpose": "Advanced control systems for industrial automation and machinery.",
        "sub_products": [
            "Modular PLCs",
            "Compact PLCs",
            "I/O Modules"
        ],
        "usages": [
            "Industrial automation",
            "Machine control",
            "Process automation",
            "Chemical plants",
            "Manufacturing lines",
            "Water treatment plants"
        ],
        "features": [
            "High reliability",
            "Real-time processing",
            "Scalable architecture"
        ]
    },
    {
        "id": "scada-hmi",
        "name": "SCADA & HMI SYSTEMS",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=SCADA+Monitor",
            "https://placehold.co/600x400?text=HMI+Touch+Panel",
            "https://placehold.co/600x400?text=Industrial+Control+Room",
            "https://placehold.co/600x400?text=Remote+Monitoring"
        ],
        "purpose": "Interfaces and systems for real-time monitoring and control of industrial processes.",
        "sub_products": [
            "SCADA Software",
            "HMI Touch Panels",
            "Industrial Monitors"
        ],
        "usages": [
            "Real-time monitoring",
            "Data logging & alarms",
            "Remote plant control",
            "Power & utilities",
            "Oil & gas",
            "Smart factories"
        ],
        "features": [
            "User-friendly interface",
            "Remote access capability",
            "Detailed data reporting"
        ]
    },
    {
        "id": "motors-vfd",
        "name": "INDUSTRIAL MOTORS & VFD / DRIVES",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Industrial+Motor",
            "https://placehold.co/600x400?text=VFD+Drive+Unit",
            "https://placehold.co/600x400?text=AC+Motor",
            "https://placehold.co/600x400?text=Motor+Control+Drive"
        ],
        "purpose": "Efficient driving force and speed control for industrial machinery.",
        "sub_products": [
            "AC / DC Motors",
            "VFD / Inverter Drives",
            "Servo Motors"
        ],
        "usages": [
            "Pumps & compressors",
            "Conveyors",
            "HVAC systems"
        ],
        "features": [
            "Energy efficient",
            "Variable speed control",
            "Robust construction"
        ]
    },
    {
        "id": "industrial-cables",
        "name": "INDUSTRIAL CABLES & WIRING",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Industrial+Power+Cable",
            "https://placehold.co/600x400?text=Control+Wiring",
            "https://placehold.co/600x400?text=Cable+Spools",
            "https://placehold.co/600x400?text=Shielded+Cable"
        ],
        "purpose": "High-grade cabling for power transmission and signal connectivity.",
        "sub_products": [
            "Power cables",
            "Control cables",
            "Instrumentation cables"
        ],
        "usages": [
            "Industrial wiring",
            "Panel connections",
            "Plant electrification"
        ],
        "features": [
            "High durability",
            "Flame retardant",
            "Excellent conductivity"
        ]
    },
    {
        "id": "industrial-lighting",
        "name": "INDUSTRIAL LIGHTING SYSTEMS",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=High+Bay+LED",
            "https://placehold.co/600x400?text=Factory+Lighting",
            "https://placehold.co/600x400?text=Flood+Light",
            "https://placehold.co/600x400?text=Industrial+Warehouse+Light"
        ],
        "purpose": "Robust lighting solutions for large-scale industrial environments.",
        "sub_products": [
            "LED High Bay Lights",
            "Flood Lights",
            "Explosion-proof lights"
        ],
        "usages": [
            "Warehouses",
            "Factories",
            "Outdoor yards"
        ],
        "features": [
            "Energy saving",
            "High lumen output",
            "Long operational life"
        ]
    },
    {
        "id": "ups-battery",
        "name": "UPS, BATTERY & POWER BACKUP",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Industrial+UPS",
            "https://placehold.co/600x400?text=Battery+Bank",
            "https://placehold.co/600x400?text=Power+Backup+System",
            "https://placehold.co/600x400?text=Inverter+System"
        ],
        "purpose": "Uninterrupted power supply solutions for critical systems.",
        "sub_products": [
            "Online UPS",
            "Industrial Batteries",
            "Inverters"
        ],
        "usages": [
            "Control rooms",
            "Data centers",
            "Automation systems"
        ],
        "features": [
            "Reliable backup",
            "Voltage stabilization",
            "Quick switchover"
        ]
    },
    {
        "id": "sensors-meters",
        "name": "SENSORS, METERS & INSTRUMENTATION",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Digital+Energy+Meter",
            "https://placehold.co/600x400?text=Pressure+Sensor",
            "https://placehold.co/600x400?text=Temperature+Guage",
            "https://placehold.co/600x400?text=Flow+Meter"
        ],
        "purpose": "Precision instruments for measurement and process monitoring.",
        "sub_products": [
            "Energy meters",
            "Temperature & pressure sensors",
            "Process instruments"
        ],
        "usages": [
            "Process monitoring",
            "Energy management",
            "Quality control"
        ],
        "features": [
            "High accuracy",
            "Digital integration",
            "Robust sensing elements"
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

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4)

print("Electric & Electronics products added successfully.")
