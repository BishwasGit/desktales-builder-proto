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
    const width = document.getElementById('customBackgroundWidth').value * 10;
    const height = document.getElementById('customBackgroundHeight').value * 10;
    canvas.width = width;
    canvas.height = height;
    drawMousePad();
}

function setMousePadSize() {
    const width = document.getElementById('customWidth').value;
    const height = document.getElementById('customHeight').value;
    canvas.width = width * 10;
    canvas.height = height * 10;

    if (overlayImage) {
        const oldWidth = overlayImage.width;
        const oldHeight = overlayImage.height;

        overlayImage.width = (oldWidth / width) * canvas.width;
        overlayImage.height = (oldHeight / height) * canvas.height;
        overlayX = (canvas.width - overlayImage.width) / 2;
        overlayY = (canvas.height - overlayImage.height) / 2;

        drawMousePad();
    } else {
        drawMousePad();
    }
}
function selectMousePadSize(width,height) {
    const selected_width = width;
    const selected_height = height;
    canvas.width = selected_width * 10;
    canvas.height = selected_height * 10;

    if (overlayImage) {
        const oldWidth = overlayImage.width;
        const oldHeight = overlayImage.height;

        overlayImage.width = (oldWidth / width) * canvas.width;
        overlayImage.height = (oldHeight / height) * canvas.height;
        overlayX = (canvas.width - overlayImage.width) / 2;
        overlayY = (canvas.height - overlayImage.height) / 2;

        drawMousePad();
    } else {
        drawMousePad();
    }
}

function drawMousePad() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = 'rgba(0, 0, 0, 1.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, 15);
    ctx.shadowColor = 'transparent';
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

function handleImageUpload(input, type) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                if (type === 'background') {
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

document.getElementById('imageInput1').addEventListener('change', function() {
    handleImageUpload(this, 'background');
});

document.getElementById('imageInput2').addEventListener('change', function() {
    handleImageUpload(this, 'overlay');
});

canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (overlayImage && isWithinOverlay(x, y)) {
        isDragging = true;
        dragStartX = x - overlayX;
        dragStartY = y - overlayY;
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

function isWithinOverlay(x, y) {
    return x >= overlayX && x <= overlayX + overlayImage.width &&
           y >= overlayY && y <= overlayY + overlayImage.height;
}

function setOverlaySize() {
    const width = document.getElementById('customOverlayWidth').value;
    const height = document.getElementById('customOverlayHeight').value;
    if (overlayImage) {
        const oldWidth = overlayImage.width;
        const oldHeight = overlayImage.height;

        overlayImage.width = width;
        overlayImage.height = height;

        overlayX += (oldWidth - width) / 2;
        overlayY += (oldHeight - height) / 2;

        drawMousePad();

        isDragging = false;
        if (dragStartX > overlayImage.width) {
            dragStartX = overlayImage.width;
        }
        if (dragStartY > overlayImage.height) {
            dragStartY = overlayImage.height;
        }
    }
}
