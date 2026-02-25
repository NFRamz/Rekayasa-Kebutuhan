        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        // State sederhana
        let pdfDoc        = null, pageNum = 1, currentUrl = '';
        const canvas      = document.getElementById('pdf-canvas');
        const ctx         = canvas.getContext('2d');
        const apiKey      = "AIzaSyDZkBrgKtAhgkJFGNsEoITyYxiG_syu0xU";
        const loadingEl   = document.getElementById('loading');
        const defaultLink = "https://drive.google.com/file/d/1ewNhvYGoxFjso9puvNEKWY0a41lAOUaZ/view?usp=sharing";

        function showLoading(show) {
            if(show){ 
                loadingEl.classList.remove('hidden');
            }else{ 
                loadingEl.classList.add('hidden');
            }
        }

        window.onload = () => {
            const saved = JSON.parse(localStorage.getItem('pdfMemori') || '{}');
            if (saved.url) {
                document.getElementById('url').value = saved.url;
                loadPDF(saved.url, saved.page || 1);
            } else {
                document.getElementById('url').value = defaultLink;
                loadPDF(defaultLink, 1);
            }
        };

        async function loadPDF(url, startPage = 1) {
            showLoading(true);
            try {
                currentUrl   = url;
                let fetchUrl = url;
                    
                const get_link_id_dokumen = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
                if (get_link_id_dokumen) {
                        fetchUrl = `https://www.googleapis.com/drive/v3/files/${get_link_id_dokumen[1]}?alt=media&key=${apiKey}`;
                }

                pdfDoc = await pdfjsLib.getDocument(fetchUrl).promise;
                document.getElementById('page-count').innerText = pdfDoc.numPages;
                
                pageNum = Math.min(startPage, pdfDoc.numPages);
                await renderPage(pageNum);
            } catch (error) {
                console.error(error);
                alert("Gagal memuat dokumen");
            }finally{
                showLoading(false);
            }
        }

        async function renderPage(num) {
            showLoading(true);
            try {
                const page     = await pdfDoc.getPage(num);
                const viewport = page.getViewport({scale: 1.5});
                canvas.height  = viewport.height;
                canvas.width   = viewport.width;
                
                await page.render({canvasContext: ctx, viewport: viewport}).promise;

                document.getElementById('page-num').innerText = num;
                localStorage.setItem('pdfMemori', JSON.stringify({url: currentUrl, page: num}));
            } finally {
                showLoading(false);
            }
        }

        document.getElementById('load').onclick = () => {
            const input = document.getElementById('url').value;
            loadPDF(input, input === currentUrl ? pageNum : 1);
        };
        
        document.getElementById('prev').onclick = () => {
            if (pageNum > 1) {renderPage(--pageNum);}
        };
        
        document.getElementById('next').onclick = () => {
            if (pageNum < pdfDoc.numPages) {renderPage(++pageNum);}
        };
