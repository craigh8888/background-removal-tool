# Image Transparency Converter

## What is this?

**Image Transparency Converter** is a free, open-source tool designed to help you manipulate images by converting specific colours to transparency. It's perfect for:

- **Designers** looking to remove backgrounds or isolate logos from images.
- **Developers** needing to prepare images for overlays on websites or applications.
- **Anyone** who needs to work with transparent images for creative or technical projects.

## Features

- **Background Removal:** Makes image backgrounds transparent with ease.
- **Colour to Transparency:** Select any colour from your image to convert to transparency, particularly useful for logo extraction or unique image effects.
- **Web Compatibility:** Prepares images for web use where transparency enhances design flexibility.

## Why Use This Tool?

This project was born out of the need for a free, highly customisable, and precise tool for image transparency conversion. Here's why we created it:

- **Lack of Free Tools:** Most existing solutions require payment or are limited in functionality.
- **Precision:** Our tool uses the Lab colour space for more accurate colour matching when converting to transparency.
- **User Control:** Offers detailed control over which colours become transparent, allowing for professional-grade results.

## Development Specifications

- **Image Loading:** Utilises FileReader and `loadImage` from the Canvas library for efficient image uploads.
- **Colour Manipulation:** Advanced algorithms convert colours to transparency based on Lab colour distance calculations.
- **Pre-processing:** Applies a slight blur to ensure cleaner transparency conversion by reducing noise.
- **Event Handling:** Manages user interactions for file uploads, colour selection, image processing, and download.
- **Data Safety:**
  - Images are processed securely but not stored. They are deleted post-processing.
  - All communication is encrypted via HTTPS.
  - No personal data is associated with images unless you choose to provide it.
- **Performance:** Optimised for real-time processing to maintain responsiveness even with large images.

## How to Use

### Viewing the Project in Action

You have two options to experience this project:

1. **Download and Run Locally:**

   - Download the `index.html` and `dist/main.js` files from this repository.
   - Place them in the same directory on your local machine.
   - Open `index.html` in your web browser to interact with the tool.

   **Note:** This method does **not** require a local server since the JavaScript (`main.js`) runs client-side. However, for testing with server-side features or if you encounter CORS issues, you might want to use a local server.

2. **Run with Node.js (for Development or Server-Side Features):**
   - Clone this repository or download the zip.
   - Navigate to the project directory in your terminal.
   - Install the required Node.js packages by running:
     ```bash
     npm install
     ```
   - Start a local server using:
     ```bash
     npx http-server
     ```
   - Open the provided URL in your browser to use the tool.

## Contributing

We welcome contributions! If you have ideas for improvements or find any bugs, please open an issue or submit a pull request.

## Licence

This project is licensed under the MIT Licence - see the [LICENCE.md](LICENCE.md) file for details..
