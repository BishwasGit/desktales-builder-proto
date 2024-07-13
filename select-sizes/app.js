const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
let backgroundImage = null;
let overlayImage = null;
let overlayX = 0;
let overlayY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

function setCustomSize() {
    const width = document.getElementById('customWidth').value * 10; // Convert cm to pixels
    const height = document.getElementById('customHeight').value * 10; // Convert cm to pixels
    canvas.width = width;
    canvas.height = height;
    drawMousePad();
}

function setMousePadSize(width, height) {
    canvas.width = width * 10; // Convert cm to pixels
    canvas.height = height * 10; // Convert cm to pixels
    drawMousePad();
}

function setOverlaySize() {
    const width = document.getElementById('overlayWidth').value;
    const height = document.getElementById('overlayHeight').value;
    if (overlayImage) {
        overlayImage.width = width;
        overlayImage.height = height;
        overlayX = (canvas.width - width) / 2; // Center the overlay horizontally
        overlayY = (canvas.height - height) / 2; // Center the overlay vertically
        drawMousePad();
    }
}

function drawMousePad() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 1.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    // Fill background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, 15);

    // Reset shadow
    ctx.shadowColor = 'transparent';

    // Draw images
    if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    if (overlayImage) {
        ctx.drawImage(overlayImage, overlayX, overlayY, overlayImage.width, overlayImage.height);
    }
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

dropzone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                if (!backgroundImage) {
                    backgroundImage = img;
                } else {
                    overlayImage = img;
                    overlayX = (canvas.width - img.width) / 2;
                    overlayY = (canvas.height - img.height) / 2;
                }
                drawMousePad();
            };
            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }
}

imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                if (!backgroundImage) {
                    backgroundImage = img;
                } else {
                    overlayImage = img;
                    overlayX = (canvas.width - img.width) / 2;
                    overlayY = (canvas.height - img.height) / 2;
                }
                drawMousePad();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

canvas.addEventListener('mousedown', function(e) {
    if (overlayImage) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= overlayX && x <= overlayX + overlayImage.width && y >= overlayY && y <= overlayY + overlayImage.height) {
            isDragging = true;
            dragStartX = x - overlayX;
            dragStartY = y - overlayY;
        }
    }
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging && overlayImage) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        overlayX = x - dragStartX;
        overlayY = y - dragStartY;

        drawMousePad();
    }
});

canvas.addEventListener('mouseup', function() {
    isDragging = false;
});

canvas.addEventListener('mouseleave', function() {
    isDragging = false;
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
    mousepadContainer.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropzone.classList.add('highlight');
}

function unhighlight() {
    dropzone.classList.remove('highlight');
}

// Initial draw
drawMousePad();

function setMousePadColor(color) {
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');
    
    // Set canvas background color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', function(e) {
    if (overlayImage) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= overlayX && x <= overlayX + overlayImage.width && y >= overlayY && y <= overlayY + overlayImage.height) {
            isDragging = true;
            dragStartX = x - overlayX;
            dragStartY = y - overlayY;
        }
    }
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging && overlayImage) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        overlayX = x - dragStartX;
        overlayY = y - dragStartY;

        drawMousePad();
    }
});

canvas.addEventListener('mouseup', function() {
    isDragging = false;
});

canvas.addEventListener('mouseleave', function() {
    isDragging = false;
});
