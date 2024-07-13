const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const dropzone = document.getElementById('dropzone');
const mousepadContainer = document.getElementById('mousepadContainer');

// Prevent default behavior for drag events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
    mousepadContainer.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop zone when dragging over it
['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, highlight, false);
});

// Unhighlight drop zone when dragging leaves it
['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropzone.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropzone.classList.add('highlight');
}

function unhighlight() {
    dropzone.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                fitImageToCanvas(img);
            };
            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }
}

function fitImageToCanvas(img) {
    const aspectRatio = img.width / img.height;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    if (img.width > canvasWidth || img.height > canvasHeight) {
        if (aspectRatio > 1) {
            img.width = canvasWidth;
            img.height = canvasWidth / aspectRatio;
        } else {
            img.height = canvasHeight;
            img.width = canvasHeight * aspectRatio;
        }
    }

    const x = (canvasWidth - img.width) / 2;
    const y = (canvasHeight - img.height) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, img.width, img.height);
}
