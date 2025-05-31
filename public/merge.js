
let img1 = null;
let img2 = null;


function initializeFileInputs() {

    document.getElementById('img1').style.display = 'none';
    document.getElementById('img2').style.display = 'none';


    document.getElementById('fileContainer1').addEventListener('click', function (e) {
        if (e.target.tagName !== 'INPUT') {
            document.getElementById('img1').click();
        }
    });

    document.getElementById('fileContainer2').addEventListener('click', function (e) {
        if (e.target.tagName !== 'INPUT') {
            document.getElementById('img2').click();
        }
    });
}


function loadImage(file, fileNumber) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = () => {

                const container = document.getElementById(`fileContainer${fileNumber}`);
                const preview = document.getElementById(`imagePreview${fileNumber}`);
                const previewImg = document.getElementById(`previewImage${fileNumber}`);
                const fileInfo = document.getElementById(`file${fileNumber}-info`);
                const uploadIcon = container.querySelector('.upload-icon');
                const uploadText = container.querySelector('.upload-text');


                previewImg.src = e.target.result;
                preview.style.display = 'block';


                uploadIcon.style.display = 'none';
                uploadText.style.display = 'none';


                const fileSize = Math.round(file.size / 1024);
                fileInfo.textContent = `${file.name} (${fileSize}KB)`;

                resolve(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}


function mergeImages() {
    if (!img1 || !img2) {
        alert("Please upload both images first.");
        return false;
    }

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const mergeDirection = document.getElementById('mergeDirection').value;

    if (mergeDirection === 'horizontal') {

        canvas.width = img1.width + img2.width;
        canvas.height = Math.max(img1.height, img2.height);
        const y1 = (canvas.height - img1.height) / 2;
        const y2 = (canvas.height - img2.height) / 2;
        ctx.drawImage(img1, 0, y1);
        ctx.drawImage(img2, img1.width, y2);
    } else {

        canvas.width = Math.max(img1.width, img2.width);
        canvas.height = img1.height + img2.height;
        const x1 = (canvas.width - img1.width) / 2;
        const x2 = (canvas.width - img2.width) / 2;
        ctx.drawImage(img1, x1, 0);
        ctx.drawImage(img2, x2, img1.height);
    }

    document.getElementById('canvasBox').style.display = 'block';
    document.getElementById('previewPlaceholder').style.display = 'none';
    return true;
}


function resetInterface() {
    img1 = null;
    img2 = null;


    document.getElementById('img1').value = '';
    document.getElementById('img2').value = '';


    [1, 2].forEach(num => {
        const container = document.getElementById(`fileContainer${num}`);
        const preview = document.getElementById(`imagePreview${num}`);
        const fileInfo = document.getElementById(`file${num}-info`);
        const uploadIcon = container.querySelector('.upload-icon');
        const uploadText = container.querySelector('.upload-text');

        preview.style.display = 'none';
        uploadIcon.style.display = 'block';
        uploadText.style.display = 'block';
        fileInfo.textContent = '';
    });


    document.getElementById('canvasBox').style.display = 'none';
    document.getElementById('previewPlaceholder').style.display = 'block';
}


function showButtonFeedback(button, message) {
    const originalHTML = button.innerHTML;
    button.innerHTML = `<i class="fas fa-check"></i> ${message}`;
    button.disabled = true;

    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
    }, 2000);
}


document.addEventListener('DOMContentLoaded', function () {
    initializeFileInputs();


    document.getElementById('img1').addEventListener('change', async function (e) {
        if (e.target.files[0]) {
            img1 = await loadImage(e.target.files[0], 1);
        }
    });

    document.getElementById('img2').addEventListener('change', async function (e) {
        if (e.target.files[0]) {
            img2 = await loadImage(e.target.files[0], 2);
        }
    });

    document.getElementById('runButton').addEventListener('click', function () {
        if (mergeImages()) {
            showButtonFeedback(this, 'Merged!');
        }
    });

    document.getElementById('saveButton').addEventListener('click', function () {
        if (!img1 || !img2) {
            alert("Please upload both images and click Run first.");
            return;
        }

        const canvas = document.getElementById('canvas');
        if (canvas.width === 0) {
            alert("Please run the merge operation first.");
            return;
        }

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'merged-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showButtonFeedback(this, 'Saved!');
    });

    document.getElementById('clearButton').addEventListener('click', function () {
        resetInterface();
        showButtonFeedback(this, 'Cleared!');
    });


    document.getElementById('previewPlaceholder').style.display = 'block';
});