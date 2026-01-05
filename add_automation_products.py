import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# Data to update/add
products_to_update = {
    "plc-systems": {
        "name": "PLC PANEL \u2013 INDUSTRIAL AUTOMATION",
        "category": "Electric & Electronics",
        "purpose": "PLC (Programmable Logic Controller) panels are used to automate machines an industrial processes by controlling motors, pumps, valves, sensors, and production lines.",
        "sub_products": [
             "Modular PLCs", "Compact PLCs", "I/O Modules" # Keeping previous or adding new? User didn't specify sub-products, but 'Solutions'.
        ],
        "usages": [
            "Manufacturing plants", "Chemical & process industries", "Water & wastewater treatment plants", "Cement, steel & power plants"
        ],
        "features": [
            "Fully automated operation", "High reliability & accuracy", "Custom-built panels as per process", "Compatible with sensors, drives & motors"
        ],
        "solutions": [
            "PLC panel supply", "Control panel design", "Industrial automation projects", "Integration with SCADA & VFD"
        ]
        # Keep existing image
    },
    "scada-hmi": {
        "name": "SCADA SYSTEM \u2013 MONITORING & CONTROL",
        "category": "Electric & Electronics",
        "purpose": "SCADA (Supervisory Control and Data Acquisition) systems are used for real-time monitoring, data logging, alarms, and remote control of industrial plants.",
        "sub_products": [
             "SCADA Software", "HMI Touch Panels", "Industrial Monitors"
        ],
        "usages": [
            "Power plants & substations", "Oil & gas pipelines", "Water distribution systems", "Large manufacturing units"
        ],
        "features": [
            "Live data monitoring", "Centralized control room", "Alarm & fault reporting", "Remote access & automation"
        ],
        "solutions": [
            "SCADA system supply", "HMI panels", "Control room setup", "PLC\u2013SCADA integration"
        ]
        # Keep existing image
    }
}

new_products_data = [
    {
        "id": "industrial-robotics",
        "name": "INDUSTRIAL ROBOTICS & AUTOMATION",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Industrial+Robot+Arm",
            "https://placehold.co/600x400?text=Robotic+Assembly+Line",
            "https://placehold.co/600x400?text=Pick+and+Place+Robot",
            "https://placehold.co/600x400?text=Automated+Welding"
        ],
        "purpose": "Industrial robots are used to automate repetitive, high-precision, and heavy-duty tasks, improving productivity, safety, and quality.",
        "sub_products": [
            "Assembly lines", "Welding & fabrication", "Pick & place operations", "Packaging & palletizing"
        ],
        "usages": [
             "Automotive & heavy industries",
             "Assembly lines",
             "Welding & fabrication",
             "Pick & place operations",
             "Packaging & palletizing"
        ],
        "features": [
            "High production efficiency", "Reduced manpower dependency", "Improved accuracy & consistency", "Safer industrial operations"
        ],
        "solutions": [
            "Robotic system supply", "Automation integration", "PLC\u2013Robot coordination", "Industrial modernization projects"
        ]
    },
    {
        "id": "smart-factory",
        "name": "PLC + SCADA + ROBOTICS (SMART FACTORY SOLUTION)",
        "category": "Electric & Electronics",
        "image": [
            "https://placehold.co/600x400?text=Smart+Factory+Dashboard",
            "https://placehold.co/600x400?text=Automated+Production+Line",
            "https://placehold.co/600x400?text=Industry+4.0+Hub",
            "https://placehold.co/600x400?text=Connected+Factory"
        ],
        "purpose": "Integrated Industry 4.0 solutions combining PLC control, SCADA monitoring, and Robotic automation.",
        "sub_products": [
            "PLC-based control panels",
            "SCADA monitoring systems",
            "Robotic automation lines",
            "Sensor & drive integration",
            "Industry 4.0 solutions"
        ],
        "usages": [
            "Full plant automation",
            "Smart manufacturing",
            "Connected enterprise"
        ],
        "features": [
            "Seamless integration",
            "Real-time data analytics",
            "End-to-end automation"
        ],
         "solutions": [
            "Turnkey automation projects",
            "Smart factory consulting"
        ]
    }
]

# Update existing products
for p in products:
    if p['id'] in products_to_update:
        update_data = products_to_update[p['id']]
        p.update(update_data) # Update fields, keep id and image

# Add new products
existing_ids = {p['id'] for p in products}
for np in new_products_data:
    if np['id'] not in existing_ids:
        products.append(np)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4)

print("Automation products updated successfully.")
