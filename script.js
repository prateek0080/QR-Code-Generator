const qrBox = document.getElementById('qr-box');
const qrContainer = document.getElementById('qrContainer');
const qrPlaceholder = document.getElementById('qrPlaceholder');
const qrInput = document.getElementById('qrText');
const genBtn = document.getElementById('genBtn');
const downloadBtn = document.getElementById('downloadBtn');
const errorMsg = document.getElementById('errorMsg');

let currentQRCode = null;
let isGenerating = false;

const showError = (message) => {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
    
    setTimeout(() => {
        errorMsg.classList.remove('show');
    }, 3000);
};

const generateQR = (text) => {
    // Prevent multiple simultaneous generations
    if (isGenerating) return;
    
    isGenerating = true;
    
    // 1. Clear previous QR and reset UI
    qrContainer.innerHTML = ""; 
    downloadBtn.classList.remove('active');
    qrPlaceholder.style.display = 'block';
    qrBox.classList.remove('has-qr');
    
    // Show loading state
    genBtn.classList.add('loading');
    genBtn.disabled = true;
    
    // Clear any previous QRCode instance
    if (currentQRCode) {
        currentQRCode.clear();
    }

    // 2. Generate new QR after a small delay to allow UI to update
    setTimeout(() => {
        try {
            currentQRCode = new QRCode(qrContainer, {
                text: text,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // 3. Update UI to show QR code
            qrPlaceholder.style.display = 'none';
            qrBox.classList.add('has-qr');

            // 4. Set up download link with improved mobile support
            setupDownloadLink();
            
        } catch (error) {
            console.error("QR Generation Error:", error);
            showError("Failed to generate QR code. Please try again.");
            resetUI();
        } finally {
            // Remove loading state
            genBtn.classList.remove('loading');
            genBtn.disabled = false;
            isGenerating = false;
        }
    }, 100);
};

const setupDownloadLink = () => {
    const startTime = Date.now();
    const maxWaitTime = 3000; // 3 seconds max
    
    const checkAndSetDownload = () => {
        // Try multiple methods to get the QR code image
        const qrImage = qrContainer.querySelector('img');
        const qrCanvas = qrContainer.querySelector('canvas');
        
        let dataURL = null;
        
        // Method 1: Check if img element exists with data URL
        if (qrImage && qrImage.src && qrImage.src.startsWith('data:image/')) {
            dataURL = qrImage.src;
        }
        // Method 2: Check if canvas exists and convert it
        else if (qrCanvas) {
            try {
                dataURL = qrCanvas.toDataURL('image/png');
            } catch (e) {
                console.error("Canvas toDataURL error:", e);
            }
        }
        // Method 3: Check the first child of qrContainer (sometimes it's the canvas directly)
        else if (qrContainer.firstChild && qrContainer.firstChild.tagName === 'CANVAS') {
            try {
                dataURL = qrContainer.firstChild.toDataURL('image/png');
            } catch (e) {
                console.error("First child canvas error:", e);
            }
        }
        
        // If we found a valid data URL, set up the download
        if (dataURL) {
            downloadBtn.setAttribute('href', dataURL);
            downloadBtn.classList.add('active');
            
            // Add timestamp to filename to ensure uniqueness
            const timestamp = new Date().getTime();
            downloadBtn.setAttribute('download', `QRCode_${timestamp}.png`);
            return true;
        }
        
        // Check if we've been waiting too long
        if (Date.now() - startTime > maxWaitTime) {
            console.warn("QR code generation timeout - trying fallback method");
            
            // Last resort: Try to get any image from the container
            const allImages = qrContainer.getElementsByTagName('img');
            if (allImages.length > 0 && allImages[0].src) {
                downloadBtn.setAttribute('href', allImages[0].src);
                downloadBtn.classList.add('active');
                return true;
            }
            
            return false;
        }
        
        return false;
    };
    
    // Try immediately (works on most desktop browsers)
    if (checkAndSetDownload()) {
        return;
    }
    
    // Start polling for mobile browsers
    const pollInterval = setInterval(() => {
        if (checkAndSetDownload()) {
            clearInterval(pollInterval);
        }
    }, 100);
    
    // Safety timeout
    setTimeout(() => {
        clearInterval(pollInterval);
        // Even if we timeout, try one last time
        checkAndSetDownload();
    }, maxWaitTime);
};

const resetUI = () => {
    genBtn.classList.remove('loading');
    genBtn.disabled = false;
    isGenerating = false;
};

genBtn.addEventListener('click', () => {
    const text = qrInput.value.trim();
    
    if (text.length > 0) {
        qrInput.classList.remove('error');
        generateQR(text);
    } else {
        qrInput.classList.add('error');
        showError("Please enter some text or a URL");
        
        setTimeout(() => {
            qrInput.classList.remove('error');
        }, 400);
    }
});

qrInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        genBtn.click();
    }
});

// Improved download button click handler
downloadBtn.addEventListener('click', (e) => {
    // If the button is not active, prevent download
    if (!downloadBtn.classList.contains('active')) {
        e.preventDefault();
        return;
    }
    
    // If href is still empty or just '#', try to get the QR code
    const href = downloadBtn.getAttribute('href');
    if (!href || href === '#') {
        e.preventDefault();
        
        // Try to find and set the image source
        const qrCanvas = qrContainer.querySelector('canvas');
        const qrImage = qrContainer.querySelector('img');
        
        if (qrCanvas) {
            try {
                const dataURL = qrCanvas.toDataURL('image/png');
                downloadBtn.setAttribute('href', dataURL);
                // Trigger download
                downloadBtn.click();
            } catch (error) {
                console.error("Download error:", error);
                showError("Failed to prepare download. Please try again.");
            }
        } else if (qrImage && qrImage.src) {
            downloadBtn.setAttribute('href', qrImage.src);
            // Trigger download
            downloadBtn.click();
        } else {
            e.preventDefault();
            showError("QR code not ready for download. Please generate it first.");
        }
    }
});

// Initialize with example text on page load
window.addEventListener('DOMContentLoaded', () => {
    // Optional: Pre-fill with example or leave empty
    // qrInput.value = "https://example.com";
    // qrInput.focus();
});