# PowerShell script to download the suit man image
# This script will download a placeholder image for the suit man and place it in public/images

# Create the directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "public/images"

# Display information
Write-Host "Downloading suit man image to public/images/suit_man.png"

# Use a placeholder image URL (replace with the actual image URL if available)
$imageUrl = "https://img.freepik.com/free-vector/business-man-cartoon-character-smart-clothes-office-style_1308-100245.jpg"

# Download the image
Invoke-WebRequest -Uri $imageUrl -OutFile "public/images/suit_man.png"

Write-Host "Download complete! The image has been saved to public/images/suit_man.png"
Write-Host "Please restart the development server with: npm run dev" 