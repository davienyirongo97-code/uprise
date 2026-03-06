import os

filepath = r'c:\Users\bsc_inf_01_21\Desktop\UPRISE\web\app-enhanced.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Generic || 'N/A' replacement
content = content.replace(" || 'N/A'", " || ''")

# Ternary matches
content = content.replace(" ? client.phoneNumber : 'N/A'", " ? client.phoneNumber : ''")
content = content.replace(" ? client.district : 'N/A'", " ? client.district : ''")
content = content.replace(" ? client.witnessName : 'N/A'", " ? client.witnessName : ''")
content = content.replace(" ? client.witnessContact : 'N/A'", " ? client.witnessContact : ''")
content = content.replace(" ? client.fullName : 'N/A'", " ? client.fullName : ''")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Successfully processed {filepath}")
