# How to Update Your Arduino Project Thumbnail

To update the Arduino Smart Vacuum Cleaner Robot project with the man in suit image, follow these steps:

## Option 1: Using the existing project3.png (Easiest)

1. I've already updated your code to use `project3.png` instead of `smartRobot`.
2. Save the man in suit image to your computer.
3. Rename it to `project3.png`.
4. Navigate to: `C:\Users\harya\OneDrive\Desktop\PORTFOLIO\src\assets`
5. Replace the existing `project3.png` file with your saved image.
6. Refresh your browser at http://localhost:5174/ (or http://localhost:5173/)

## Option 2: Using the proper smart_robot.png

1. Save the man in suit image to your computer.
2. Rename it to `smart_robot.png`.
3. Navigate to: `C:\Users\harya\OneDrive\Desktop\PORTFOLIO\src\assets\projects`
4. Replace the existing `smart_robot.png` file with your saved image.
5. Edit `src/constants/index.js` to use `smartRobot` instead of `project3`:
   ```js
   image: smartRobot, // Change from project3 back to smartRobot
   ```
6. Restart the development server and refresh your browser.

## Important Notes

- According to the error messages, your server is running on port 5174, so use http://localhost:5174/ to access your site.
- If you're having trouble with file paths, you can also try putting the image directly in the `public` folder and then use:
  ```js
  image: "/man_in_suit.png", // Direct reference to a file in the public folder
  ```
- Make sure the image has the correct dimensions (ideally maintaining the same aspect ratio as your other project images). 