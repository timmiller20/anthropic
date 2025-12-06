# 🚴 Cyclist Photo Map

A simple web application that allows cyclists to upload photos from their rides and pin them to an interactive map. Perfect for documenting your cycling adventures!

## Features

- **📷 Photo Upload**: Upload photos from your cycling trips
- **🗺️ Interactive Map**: Click anywhere on the map to select a location
- **📍 Photo Markers**: View all your photos as markers on the map
- **💬 Descriptions**: Add optional descriptions to your photos
- **💾 Local Storage**: All photos are saved in your browser's local storage
- **🖼️ Photo Popups**: Click on any marker to see the photo and details
- **🗑️ Delete Photos**: Remove individual photos one at a time

## How to Use

1. **Open the App**: Simply open `index.html` in your web browser

2. **Upload a Photo**:
   - Click on the upload box
   - Select a photo from your device
   - You'll see a preview of the selected photo

3. **Select a Location**:
   - Click anywhere on the map to select where the photo was taken
   - A temporary marker (📍) will appear at the selected location
   - You'll see the coordinates displayed in the sidebar

4. **Add Description** (Optional):
   - Type a description or note about your ride in the text area

5. **Add to Map**:
   - Click the "Add to Map" button
   - Your photo will appear as a bike marker (🚴) on the map

6. **View Photos**:
   - Click on any bike marker to see the photo in a popup
   - The popup shows the photo, description, coordinates, and date

7. **Delete Photos**:
   - Click "Delete" in a photo's popup to remove it

## Technical Details

- **Frontend**: HTML, CSS, JavaScript
- **Map Library**: Leaflet.js (open-source)
- **Map Tiles**: OpenStreetMap
- **Storage**: Browser LocalStorage
- **No Backend Required**: Everything runs in your browser

## Getting Started

No installation required! Just:

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the directory
cd anthropic

# Open index.html in your browser
# On macOS:
open index.html

# On Linux:
xdg-open index.html

# On Windows:
start index.html
```

Or simply double-click `index.html` to open it in your default browser.

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

## Privacy

All photos and data are stored locally in your browser using LocalStorage. Nothing is uploaded to any server. Your photos remain private on your device.

## Customization

You can customize the default map location by editing the coordinates in `app.js`:

```javascript
// Line ~31 in app.js
this.map = L.map('map').setView([37.7749, -122.4194], 12);
// Change [latitude, longitude] to your preferred starting location
```

## Limitations

- Photos are stored as base64 in LocalStorage (typically limited to ~5-10MB depending on browser)
- Photos are only accessible on the browser/device where they were added
- Clearing browser data will delete all saved photos

## Future Enhancements

Potential features for future versions:
- Export/import photos as JSON
- GPS location from photo EXIF data
- Route tracking between photos
- Photo filtering by date
- Search functionality
- Backend integration for multi-device sync

## License

Open source - feel free to modify and use as you wish!

## Support

For issues or questions, please open an issue on the repository.

---

Happy cycling! 🚴‍♂️🚴‍♀️
