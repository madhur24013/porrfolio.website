# How to Add the Man in Suit Image to Your Portfolio

Since we're having issues with the project3.png file, let's use a more direct approach:

## Step 1: Save the Image to the Public Folder

1. Save the man in suit image from your conversation
2. Rename it to `man_in_suit.png`
3. Copy it to your project's public folder: 
   ```
   C:\Users\harya\OneDrive\Desktop\PORTFOLIO\public
   ```

## Step 2: Update Your Constants File

Now, update the project in your constants file to use this public image:

1. Open `src/constants/index.js`
2. Find the Arduino Smart Vacuum Cleaner Robot project entry
3. Change the `image` property to use an absolute path:

```javascript
{
  name: "Arduino Smart Vacuum Cleaner Robot",
  description:
    "Developed an intelligent vacuum cleaner robot using Arduino and C++. Features include obstacle detection, path planning, and efficient cleaning patterns.",
  tags: [
    {
      name: "C++",
      color: "blue-text-gradient",
    },
    {
      name: "Arduino",
      color: "green-text-gradient",
    },
    {
      name: "IoT",
      color: "orange-text-gradient",
    },
    {
      name: "Hardware",
      color: "pink-text-gradient",
    },
  ],
  image: "/man_in_suit.png", // Change this line to use a direct path
  video: vacuumRobotVideo,
  source_code_link: "https://github.com/madhur24013/Iot.website.git",
},
```

## Step 3: Restart the Server and Check

1. Save all your changes
2. Stop and restart the development server with `npm run dev`
3. Open your site in the browser: http://localhost:5173/
4. Scroll to the Projects section to see the Arduino Smart Vacuum Cleaner Robot card

The image should now appear as the thumbnail for your project. This approach bypasses any import issues by referencing the file directly from the public folder. 