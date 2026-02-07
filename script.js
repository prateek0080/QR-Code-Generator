const qrBox = document.getElementById('qr-box');
const qrContainer = document.getElementById('qrContainer');
const qrInput = document.getElementById('qrText');
const genBtn = document.getElementById('genBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Function to generate QR
const generateQR = (text) => {
    qrContainer.innerHTML = ""; // Clear previous
    
    // Generate new QR
    new QRCode(qrContainer, {
        text: text,
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // Add classes for styling/animation
    qrBox.classList.add('show-qr');
    qrContainer.style.border = "1px solid #ddd"; // Add subtle border around QR
    
    // Logic for Download Button
    setTimeout(() => {
        const qrImage = qrContainer.querySelector('img');
        if (qrImage && qrImage.src) {
            downloadBtn.setAttribute('href', qrImage.src);
            downloadBtn.classList.add('active'); // Trigger animation
        }
    }, 100);
};

// Event Listener
genBtn.addEventListener('click', () => {
    const text = qrInput.value.trim();
    
    if (text.length > 0) {
        // Remove error class if present
        qrInput.classList.remove('error');
        generateQR(text);
    } else {
        // Add error class to shake input
        qrInput.classList.add('error');
        
        // Remove class after animation finishes so it can run again
        setTimeout(() => {
            qrInput.classList.remove('error');
        }, 400);
    }
});

// Optional: Allow "Enter" key to trigger generation
qrInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        genBtn.click();
    }
});