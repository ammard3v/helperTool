document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('pdf-upload');
    const processBtn = document.getElementById('process-btn');
    const status = document.getElementById('status');
    const fileInfo = document.getElementById('file-info');
    const pageCount = document.getElementById('page-count');
    const uploadText = document.getElementById('upload-text');
    const mergeDirection = document.getElementById('mergeDirection');
    const pageSize = document.getElementById('pageSize');

    const A4_WIDTH = 595;
    const A4_HEIGHT = 842;

    fileInput.addEventListener('change', async () => {
        if (fileInput.files.length) {
            const file = fileInput.files[0];
            fileInfo.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            uploadText.style.display = 'none';

            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
                const pages = pdfDoc.getPageCount();
                pageCount.textContent = `${pages} page${pages !== 1 ? 's' : ''}`;
                processBtn.disabled = false;
                status.textContent = "Ready to process";
            } catch (error) {
                status.textContent = "Error reading PDF: " + error.message;
                uploadText.style.display = 'block';
            }
        } else {
            uploadText.style.display = 'block';
        }
    });

    processBtn.addEventListener('click', async () => {
        try {
            processBtn.disabled = true;
            status.textContent = "Processing PDF...";
            processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing';

            const file = fileInput.files[0];
            const arrayBuffer = await file.arrayBuffer();
            const originalPdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const outputPdf = await PDFLib.PDFDocument.create();
            const totalPages = originalPdf.getPageCount();
            const direction = mergeDirection.value;
            const useA4 = pageSize.value === 'a4';

            for (let i = 0; i < totalPages; i += 2) {
                const pagesToCopy = [];
                if (i < totalPages) pagesToCopy.push(i);
                if (i + 1 < totalPages) pagesToCopy.push(i + 1);

                const copiedPages = await outputPdf.copyPages(originalPdf, pagesToCopy);
                const page1 = copiedPages[0];
                const page2 = copiedPages[1] || null;

                const width = page1.getWidth();
                const height = page1.getHeight();

                if (direction === 'vertical') {
                    const stackedWidth = useA4 ? A4_WIDTH : width;
                    const stackedHeight = useA4 ? A4_HEIGHT : height * 2;
                    const stackedPage = outputPdf.addPage([stackedWidth, stackedHeight]);
                    const scale = useA4 ? Math.min(
                        A4_WIDTH / width,
                        (A4_HEIGHT / 2) / height
                    ) : 1;

                    const embedPage1 = await outputPdf.embedPage(page1);
                    stackedPage.drawPage(embedPage1, {
                        x: useA4 ? (A4_WIDTH - width * scale) / 2 : 0,
                        y: useA4 ? (A4_HEIGHT / 2) + (A4_HEIGHT / 2 - height * scale) / 2 : height,
                        width: width * scale,
                        height: height * scale
                    });

                    if (page2) {
                        const embedPage2 = await outputPdf.embedPage(page2);
                        stackedPage.drawPage(embedPage2, {
                            x: useA4 ? (A4_WIDTH - width * scale) / 2 : 0,
                            y: useA4 ? (A4_HEIGHT / 2 - height * scale) / 2 : 0,
                            width: width * scale,
                            height: height * scale
                        });
                    } else if (useA4) {
                        stackedPage.drawRectangle({
                            x: 0,
                            y: 0,
                            width: A4_WIDTH,
                            height: A4_HEIGHT / 2,
                            borderColor: PDFLib.rgb(1, 1, 1),
                            borderWidth: 0,
                            color: PDFLib.rgb(1, 1, 1)
                        });
                    }
                } else {
                    const stackedWidth = useA4 ? A4_WIDTH : width * 2;
                    const stackedHeight = useA4 ? A4_HEIGHT : height;
                    const stackedPage = outputPdf.addPage([stackedWidth, stackedHeight]);

                    const scale = useA4 ? Math.min(
                        (A4_WIDTH / 2) / width,
                        A4_HEIGHT / height
                    ) : 1;

                    const embedPage1 = await outputPdf.embedPage(page1);
                    stackedPage.drawPage(embedPage1, {
                        x: useA4 ? (A4_WIDTH / 2 - width * scale) / 2 : 0,
                        y: useA4 ? (A4_HEIGHT - height * scale) / 2 : 0,
                        width: width * scale,
                        height: height * scale
                    });

                    if (page2) {
                        const embedPage2 = await outputPdf.embedPage(page2);
                        stackedPage.drawPage(embedPage2, {
                            x: useA4 ? A4_WIDTH / 2 + (A4_WIDTH / 2 - width * scale) / 2 : width,
                            y: useA4 ? (A4_HEIGHT - height * scale) / 2 : 0,
                            width: width * scale,
                            height: height * scale
                        });
                    } else if (useA4) {
                        stackedPage.drawRectangle({
                            x: A4_WIDTH / 2,
                            y: 0,
                            width: A4_WIDTH / 2,
                            height: A4_HEIGHT,
                            borderColor: PDFLib.rgb(1, 1, 1),
                            borderWidth: 0,
                            color: PDFLib.rgb(1, 1, 1)
                        });
                    }
                }
            }

            const pdfBytes = await outputPdf.save();
            download(pdfBytes, "stacked_pages.pdf", "application/pdf");

            status.textContent = "Success! Your stacked PDF is downloading.";
            processBtn.innerHTML = '<i class="fas fa-check"></i> Done!';
            setTimeout(() => {
                processBtn.innerHTML = '<i class="fas fa-layer-group"></i> Stack Pages';
                processBtn.disabled = false;
            }, 2000);
        } catch (error) {
            status.textContent = "Error: " + error.message;
            processBtn.disabled = false;
            processBtn.innerHTML = '<i class="fas fa-layer-group"></i> Stack Pages';
            console.error(error);
        }
    });
});