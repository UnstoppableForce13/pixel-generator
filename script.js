const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
const pixelSizeSlider = document.getElementById('pixel-size');
const pixelSizeValue = document.getElementById('pixel-size-value');
const previewModeCheckbox = document.getElementById('preview-mode');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');

let originalImage = null;

function drawImageOnCanvas(image) {
  const ctx = canvas.getContext('2d');
  const pixelSize = parseInt(pixelSizeSlider.value);
  const width = image.width;
  const height = image.height;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  if (previewModeCheckbox.checked) {
    applyPixelation(ctx, width, height, pixelSize);
  }
}

function applyPixelation(ctx, width, height, pixelSize) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const index = (y * width + x) * 4;

      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      for (let ky = 0; ky < pixelSize; ky++) {
        for (let kx = 0; kx < pixelSize; kx++) {
          const pixelIndex = ((y + ky) * width + (x + kx)) * 4;

          if (pixelIndex < data.length) {
            data[pixelIndex] = r;
            data[pixelIndex + 1] = g;
            data[pixelIndex + 2] = b;
            data[pixelIndex + 3] = a;
          }
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

fileInput.addEventListener('change', (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
      img.src = e.target.result;
      img.onload = () => {
        originalImage = img;
        drawImageOnCanvas(img);
      };
    };

    reader.readAsDataURL(files[0]);
  }
});

pixelSizeSlider.addEventListener('input', () => {
  pixelSizeValue.textContent = pixelSizeSlider.value;
  if (originalImage) {
    drawImageOnCanvas(originalImage);
  }
});

previewModeCheckbox.addEventListener('change', () => {
  if (originalImage) {
    drawImageOnCanvas(originalImage);
  }
});

downloadBtn.addEventListener('click', () => {
  if (canvas.toDataURL()) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'pixel-art.png';
    link.click();
  }
});

resetBtn.addEventListener('click', () => {
  fileInput.value = ''; // Reset file input
  canvas.width = 0;
  canvas.height = 0;
  originalImage = null;
});
