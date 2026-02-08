const qrBox = document.getElementById('qr-box');
const qrContainer = document.getElementById('qrContainer');
const qrInput = document.getElementById('qrText');
const genBtn = document.getElementById('genBtn');
const downloadBtn = document.getElementById('downloadBtn');

const generateQR = (text) => {
    // 1. Clear previous QR and reset UI
    qrContainer.innerHTML = ""; 
    downloadBtn.classList.remove('active');
    qrBox.classList.remove('show-qr');

    // 2. Generate new QR
    new QRCode(qrContainer, {
        text: text,
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // 3. Expand the container
    qrBox.classList.add('show-qr');
    
    // 4. MOBILE FIX: Poll for the image
    // QRCode.js creates a canvas and then an img. 
    // On mobile, the img.src takes a few milliseconds to populate.
    let checkInterval = setInterval(() => {
        const qrImage = qrContainer.querySelector('img');
        
        // Check if image exists and has a valid Base64 source
        if (qrImage && qrImage.getAttribute('src')) {
            downloadBtn.setAttribute('href', qrImage.src);
            downloadBtn.classList.add('active');
            clearInterval(checkInterval); // Stop polling once found
        }
    }, 100);

    // Safety timeout: Stop looking after 3 seconds
    setTimeout(() => clearInterval(checkInterval), 3000);
};

genBtn.addEventListener('click', () => {
    const text = qrInput.value.trim();
    
    if (text.length > 0) {
        qrInput.classList.remove('error');
        generateQR(text);
    } else {
        qrInput.classList.add('error');
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