# PowerShell script to save the IoT Website image
# This will create a new image file in the public/images folder

# Create the directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "public/images"

# Display information
Write-Host "Creating IoT Website image in public/images/iot_website.png"

# Download a relevant IoT website image
$imageUrl = "https://img.freepik.com/free-vector/internet-things-concept-smart-home-technology_107791-1523.jpg"

# Download the image
Invoke-WebRequest -Uri $imageUrl -OutFile "public/images/iot_website.png"

Write-Host "IoT Website image has been saved to public/images/iot_website.png" 