import { createCanvas, loadImage } from "canvas";

let imageData = null;
let canvas = null;
let ctx = null;
let originalImageData = null;

document
  .getElementById("fileInput")
  .addEventListener("change", async function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      loadImage(e.target.result).then((image) => {
        canvas = createCanvas(image.width, image.height);
        ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0);
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        originalImageData = new Uint8ClampedArray(imageData.data);

        // Show original image before processing
        document.getElementById("beforeImage").src = e.target.result;
        document.getElementById("processButton").disabled = false;
        document.getElementById("downloadButton").disabled = true;
      });
    };
    reader.readAsDataURL(file);
  });

document.getElementById("processButton").addEventListener("click", function () {
  if (!canvas || !ctx || !originalImageData) return;

  const selectedColor = document.getElementById("colorSelect").value;
  const rgba = hexToRgba(selectedColor);

  // Reset to original image data before processing
  imageData.data.set(originalImageData);

  // Apply a slight blur to reduce noise before processing
  blurImageData(imageData, 1);

  // Process the image data with a more precise color match using Lab color space
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (
      colorDistanceLab(
        rgbToLab(imageData.data.slice(i, i + 3)),
        rgbToLab([rgba.r, rgba.g, rgba.b])
      ) < 10 // Reduced threshold for logo precision
    ) {
      imageData.data[i + 3] = 0; // Set alpha to 0 for transparency
    }
  }

  ctx.putImageData(imageData, 0, 0);
  document.getElementById("afterImage").src = canvas.toDataURL("image/png");
  this.disabled = true;
  document.getElementById("downloadButton").disabled = false;
});

document
  .getElementById("downloadButton")
  .addEventListener("click", function () {
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "transparent-image.png";
    link.href = document.getElementById("afterImage").src;
    link.click();
  });

function hexToRgba(hex) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return {
      r: (c >> 16) & 255,
      g: (c >> 8) & 255,
      b: c & 255,
      a: 1,
    };
  }
  throw new Error("Bad Hex");
}

function rgbToLab(rgb) {
  let r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255;
  let x, y, z;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

function colorDistanceLab(lab1, lab2) {
  return Math.sqrt(
    Math.pow(lab1[0] - lab2[0], 2) +
      Math.pow(lab1[1] - lab2[1], 2) +
      Math.pow(lab1[2] - lab2[2], 2)
  );
}

// Add a simple blur function to reduce noise before processing
function blurImageData(imageData, radius = 1) {
  const tempImageData = new ImageData(imageData.width, imageData.height);
  const kernelSize = radius * 2 + 1;
  const kernel = new Array(kernelSize * kernelSize).fill(
    1 / (kernelSize * kernelSize)
  );

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      let r = 0,
        g = 0,
        b = 0;
      let kIndex = 0;
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          let px = x + kx;
          let py = y + ky;
          // Ensure we're within image bounds
          if (
            px >= 0 &&
            px < imageData.width &&
            py >= 0 &&
            py < imageData.height
          ) {
            let index = (py * imageData.width + px) * 4;
            r += imageData.data[index] * kernel[kIndex];
            g += imageData.data[index + 1] * kernel[kIndex];
            b += imageData.data[index + 2] * kernel[kIndex];
          }
          kIndex++;
        }
      }
      let index = (y * imageData.width + x) * 4;
      tempImageData.data[index] = r;
      tempImageData.data[index + 1] = g;
      tempImageData.data[index + 2] = b;
      tempImageData.data[index + 3] = imageData.data[index + 3];
    }
  }
  imageData.data.set(tempImageData.data);
}

// Disable buttons initially
document.getElementById("processButton").disabled = true;
document.getElementById("downloadButton").disabled = true;

document.getElementById("colorSelect").addEventListener("change", function () {
  console.log("Color changed to", this.value);
  // Additional logic for color transparency would go here
});
