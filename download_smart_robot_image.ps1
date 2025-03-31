# PowerShell script to save the SMART ROBOT image
# This will create a new image file in the public/images folder

# Create the directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "public/images"

# Display information
Write-Host "Creating SMART ROBOT image in public/images/smart_robot_image.png"

# Save the base64 image data to a file
$base64ImageUrl = "https://img.freepik.com/free-vector/man-suit-standing-next-vacuum-cleaner-robot-with-yellow-wheels_1308-102245.jpg"

# Download the image
Invoke-WebRequest -Uri $base64ImageUrl -OutFile "public/images/smart_robot_image.png"

Write-Host "SMART ROBOT image has been saved to public/images/smart_robot_image.png" 