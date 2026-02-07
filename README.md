# 📱 Modern QR Code Generator

A sleek, responsive, and animated web application that generates QR codes instantly from text or URLs. This project features a modern UI with animated gradient backgrounds, input validation, and one-click image downloading.

## ✨ Features

* **Modern UI/UX:** Clean "Glassmorphism" inspired card design with soft shadows.
* **Animated Background:** soothing, shifting gradient background using CSS animations.
* **Interactive Elements:** Hover effects, entry animations, and a "pop" effect when the QR code is generated.
* **Input Validation:** Visual "shake" error animation if the user tries to generate without text.
* **Instant Download:** Automatically generates a download link for the created QR code.
* **Fully Responsive:** optimized for desktop, tablets, and mobile devices.

## 🛠️ Tech Stack

* **HTML5:** Semantic structure.
* **CSS3:** Flexbox, CSS Variables, Keyframe Animations, Media Queries.
* **JavaScript (ES6):** DOM manipulation and logic.
* **Libraries:**
    * [QRCode.js](https://davidshimjs.github.io/qrcodejs/) (via CDN) - For generating the QR code canvas.
    * [Google Fonts](https://fonts.google.com/) - Poppins font family.


## 📖 Usage

1.  **Enter Content:** Type a URL (e.g., `https://google.com`) or any text into the input field.
2.  **Generate:** Click the **"Generate QR Code"** button.
    * *If the field is empty, the input box will shake to alert you.*
3.  **Download:** Once the QR code appears, a **"Download"** button will slide up. Click it to save the QR code as a `.png` file.
