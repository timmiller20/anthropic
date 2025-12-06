// Cyclist Photo Map Application
// This app allows cyclists to upload photos and pin them to a map

class CyclistPhotoMap {
    constructor() {
        this.map = null;
        this.selectedLocation = null;
        this.currentPhoto = null;
        this.photos = [];
        this.markers = [];
        this.tempMarker = null;

        this.init();
    }

    init() {
        // Initialize the map
        this.initMap();

        // Load saved photos from localStorage
        this.loadPhotos();

        // Set up event listeners
        this.setupEventListeners();

        // Display existing photos on map
        this.displayPhotos();
    }

    initMap() {
        // Initialize map centered on a default location (can be changed)
        // Default: San Francisco area - you can change this to your preferred location
        this.map = L.map('map').setView([37.7749, -122.4194], 12);

        // Add OpenStreetMap tiles (free and open-source)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Add click event to select location
        this.map.on('click', (e) => this.selectLocation(e));

        console.log('Map initialized successfully');
    }

    setupEventListeners() {
        // Photo upload
        const photoUpload = document.getElementById('photo-upload');
        photoUpload.addEventListener('change', (e) => this.handlePhotoUpload(e));

        // Remove photo
        const removePhotoBtn = document.getElementById('remove-photo');
        removePhotoBtn.addEventListener('click', () => this.removePhoto());

        // Add to map button
        const addToMapBtn = document.getElementById('add-to-map');
        addToMapBtn.addEventListener('click', () => this.addPhotoToMap());
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Read the file
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentPhoto = e.target.result;
            this.showPhotoPreview(e.target.result);
            this.checkCanAddToMap();
        };
        reader.readAsDataURL(file);
    }

    showPhotoPreview(imageData) {
        const previewSection = document.getElementById('preview-section');
        const photoPreview = document.getElementById('photo-preview');

        photoPreview.src = imageData;
        previewSection.style.display = 'block';

        // Hide upload box
        document.querySelector('.upload-section').style.display = 'none';
    }

    removePhoto() {
        this.currentPhoto = null;
        const previewSection = document.getElementById('preview-section');
        const photoPreview = document.getElementById('photo-preview');

        previewSection.style.display = 'none';
        photoPreview.src = '';

        // Show upload box again
        document.querySelector('.upload-section').style.display = 'block';

        // Reset file input
        document.getElementById('photo-upload').value = '';

        this.checkCanAddToMap();
    }

    selectLocation(event) {
        this.selectedLocation = {
            lat: event.latlng.lat,
            lng: event.latlng.lng
        };

        // Update location display
        const locationDisplay = document.getElementById('selected-location');
        locationDisplay.innerHTML = `
            <strong>Selected:</strong><br>
            Lat: ${this.selectedLocation.lat.toFixed(6)}<br>
            Lng: ${this.selectedLocation.lng.toFixed(6)}
        `;
        locationDisplay.classList.add('selected');

        // Remove old temporary marker if exists
        if (this.tempMarker) {
            this.map.removeLayer(this.tempMarker);
        }

        // Add temporary marker with bike icon
        this.tempMarker = L.marker([this.selectedLocation.lat, this.selectedLocation.lng], {
            icon: L.divIcon({
                html: '📍',
                className: 'temp-marker',
                iconSize: [30, 30]
            })
        }).addTo(this.map);

        this.checkCanAddToMap();
    }

    checkCanAddToMap() {
        const addBtn = document.getElementById('add-to-map');
        addBtn.disabled = !(this.currentPhoto && this.selectedLocation);
    }

    addPhotoToMap() {
        if (!this.currentPhoto || !this.selectedLocation) {
            alert('Please select both a photo and a location');
            return;
        }

        const description = document.getElementById('photo-description').value || '';

        // Create photo object
        const photo = {
            id: Date.now(),
            image: this.currentPhoto,
            lat: this.selectedLocation.lat,
            lng: this.selectedLocation.lng,
            description: description,
            timestamp: new Date().toISOString()
        };

        // Add to photos array
        this.photos.push(photo);

        // Save to localStorage
        this.savePhotos();

        // Add marker to map
        this.addMarker(photo);

        // Remove temporary marker
        if (this.tempMarker) {
            this.map.removeLayer(this.tempMarker);
            this.tempMarker = null;
        }

        // Reset form
        this.resetForm();

        // Pan to the new marker
        this.map.setView([photo.lat, photo.lng], 15);

        console.log('Photo added to map:', photo);
    }

    addMarker(photo) {
        // Create custom icon with bike emoji
        const customIcon = L.divIcon({
            html: '🚴',
            className: 'photo-marker',
            iconSize: [30, 30]
        });

        // Create marker
        const marker = L.marker([photo.lat, photo.lng], { icon: customIcon })
            .addTo(this.map);

        // Create popup content
        const popupContent = this.createPopupContent(photo);

        // Bind popup
        marker.bindPopup(popupContent, {
            maxWidth: 250,
            className: 'photo-popup-container'
        });

        // Store marker reference
        this.markers.push({
            id: photo.id,
            marker: marker
        });

        // Update popup content after binding (for delete button event)
        marker.on('popupopen', () => {
            const deleteBtn = document.querySelector(`[data-photo-id="${photo.id}"]`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deletePhoto(photo.id));
            }
        });
    }

    createPopupContent(photo) {
        const date = new Date(photo.timestamp).toLocaleDateString();
        return `
            <div class="photo-popup">
                <img src="${photo.image}" alt="Cycling photo">
                ${photo.description ? `<p class="description">${photo.description}</p>` : ''}
                <p class="coordinates">📍 ${photo.lat.toFixed(4)}, ${photo.lng.toFixed(4)}</p>
                <p class="coordinates">📅 ${date}</p>
                <button class="delete-btn" data-photo-id="${photo.id}">Delete</button>
            </div>
        `;
    }

    deletePhoto(photoId) {
        // Remove from photos array
        this.photos = this.photos.filter(p => p.id !== photoId);

        // Remove marker from map
        const markerObj = this.markers.find(m => m.id === photoId);
        if (markerObj) {
            this.map.removeLayer(markerObj.marker);
            this.markers = this.markers.filter(m => m.id !== photoId);
        }

        // Save to localStorage
        this.savePhotos();

        console.log('Photo deleted:', photoId);
    }

    resetForm() {
        // Reset photo
        this.removePhoto();

        // Reset location
        this.selectedLocation = null;
        const locationDisplay = document.getElementById('selected-location');
        locationDisplay.innerHTML = '<span>No location selected</span>';
        locationDisplay.classList.remove('selected');

        // Reset description
        document.getElementById('photo-description').value = '';

        // Disable add button
        this.checkCanAddToMap();
    }

    savePhotos() {
        try {
            localStorage.setItem('cyclistPhotos', JSON.stringify(this.photos));
            console.log('Photos saved to localStorage');
        } catch (error) {
            console.error('Error saving photos:', error);
            alert('Error saving photos. Your storage might be full.');
        }
    }

    loadPhotos() {
        try {
            const saved = localStorage.getItem('cyclistPhotos');
            if (saved) {
                this.photos = JSON.parse(saved);
                console.log('Loaded', this.photos.length, 'photos from localStorage');
            }
        } catch (error) {
            console.error('Error loading photos:', error);
            this.photos = [];
        }
    }

    displayPhotos() {
        // Display all saved photos on the map
        this.photos.forEach(photo => {
            this.addMarker(photo);
        });

        // If there are photos, fit map to show all markers
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers.map(m => m.marker));
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CyclistPhotoMap();
    console.log('Cyclist Photo Map app initialized');
});
