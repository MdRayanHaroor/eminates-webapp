import json
import os

file_path = r'd:\EminatesWebsite\eminates-webapp\src\data\product_details.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# Sort by Category then by Name
# Case insensitive sorting for better results
products.sort(key=lambda x: (x.get('category', '').lower(), x.get('name', '').lower()))

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4)

print("Products sorted by Category and Name successfully.")
