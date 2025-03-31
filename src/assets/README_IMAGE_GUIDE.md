# How to Add Your Arduino Smart Vacuum Cleaner Robot Image

To add your own image for the Arduino Smart Vacuum Cleaner Robot project, follow these steps:

## Option 1: Replace the existing image file

1. Prepare your image file:
   - Size: Ideally around 1200x800 pixels or 16:9 aspect ratio
   - Format: PNG or JPG format
   - Name: `smart_robot.png`

2. Replace the file:
   - Navigate to the `src/assets` folder
   - Replace the existing `smart_robot.png` file with your image

3. Restart the development server to see your changes:
   - Press `Ctrl+C` to stop the server (if running)
   - Run `npm run dev` to start it again

## Option 2: Add a new image file

1. Prepare your image file:
   - Size: Ideally around 1200x800 pixels or 16:9 aspect ratio
   - Format: PNG or JPG format
   - Choose a meaningful name, e.g., `arduino_robot.png`

2. Add the file:
   - Place the file in the `src/assets` folder

3. Update the imports:
   - Open `src/assets/index.js`
   - Add an import line: `import arduinoRobot from './arduino_robot.png';`
   - Add the name to the export list at the bottom

4. Update the project:
   - Open `src/constants/index.js`
   - Find the Arduino project entry
   - Update the `image` property to use your new image: `image: arduinoRobot,`

5. Restart the development server to see your changes 