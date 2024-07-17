const container = document.getElementById('container');
const imageUpload = document.getElementById('imageUpload');
const colorPicker = document.getElementById('colorPicker');

function setContainerDimensions() {
    const width = document.getElementById('containerWidth').value;
    const height = document.getElementById('containerHeight').value;
    container.style.width = width + 'px';
    container.style.height = height + 'px';
}

imageUpload.addEventListener('change', function(event) {
    const files = event.target.files;
    if (files.length > 5) {
        alert('You can only upload up to 5 images.');
        return;
    }

    Array.from(files).forEach(file => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.classList.add('resizable-draggable');
        container.appendChild(img);

        interact(img)
            .draggable({
                onmove: dragMoveListener,
                restrict: {
                    restriction: container,
                    endOnly: true,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                },
            })
            .resizable({
                edges: { top: true, left: true, bottom: true, right: true },
                corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true }
            })
            .on('resizemove', function(event) {
                let { x, y } = event.target.dataset;

                x = (parseFloat(x) || 0) + event.deltaRect.left;
                y = (parseFloat(y) || 0) + event.deltaRect.top;

                Object.assign(event.target.style, {
                    width: `${event.rect.width}px`,
                    height: `${event.rect.height}px`,
                    transform: `translate(${x}px, ${y}px)`
                });

                Object.assign(event.target.dataset, { x, y });
            });
    });
});

colorPicker.addEventListener('input', function(event) {
    container.style.backgroundColor = event.target.value;
});

function dragMoveListener(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

window.dragMoveListener = dragMoveListener;
