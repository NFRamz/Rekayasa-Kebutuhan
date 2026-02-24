        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        // State sederhana
        let pdfDoc = null, pageNum = 1, currentUrl = '';
        const canvas = document.getElementById('pdf-canvas');
        const ctx = canvas.getContext('2d');
        const apiKey = "AIzaSyDZkBrgKtAhgkJFGNsEoITyYxiG_syu0xU";
        const loadingEl = document.getElementById('loading');

        // Fungsi Tampilkan/Sembunyikan Loading
        function showLoading(show) {
            if(show) loadingEl.classList.remove('hidden');
            else loadingEl.classList.add('hidden');
        }

        // 1. Auto-load saat web dibuka
        window.onload = () => {
            const saved = JSON.parse(localStorage.getItem('pdfMemori') || '{}');
            if (saved.url) {
                document.getElementById('url').value = saved.url;
                loadPDF(saved.url, saved.page || 1);
            }
        };

        // 2. Fungsi Utama Muat PDF
        async function loadPDF(url, startPage = 1) {
            showLoading(true);
            try {
                currentUrl = url;
                let fetchUrl = url;

                // Jika link GDrive, ubah pakai API Key
                const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
                if (match) fetchUrl = `https://www.googleapis.com/drive/v3/files/${match[1]}?alt=media&key=${apiKey}`;

                // Tarik dokumen
                pdfDoc = await pdfjsLib.getDocument(fetchUrl).promise;
                document.getElementById('page-count').innerText = pdfDoc.numPages;
                
                pageNum = Math.min(startPage, pdfDoc.numPages);
                await renderPage(pageNum);
            } catch (error) {
                console.error(error);
                alert("Gagal memuat dokumen. Cek link dan pastikan file bersifat publik.");
                showLoading(false);
            }
        }

        // 3. Fungsi Gambar Halaman
        async function renderPage(num) {
            showLoading(true);
            try {
                const page = await pdfDoc.getPage(num);
                const viewport = page.getViewport({scale: 1.5}); // 1.5x agar cukup tajam
                
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                await page.render({canvasContext: ctx, viewport: viewport}).promise;

                // Update UI & Simpan ke memori
                document.getElementById('page-num').innerText = num;
                localStorage.setItem('pdfMemori', JSON.stringify({url: currentUrl, page: num}));
            } finally {
                showLoading(false);
            }
        }

        // 4. Aksi Tombol
        document.getElementById('load').onclick = () => {
            const input = document.getElementById('url').value;
            loadPDF(input, input === currentUrl ? pageNum : 1);
        };
        
        document.getElementById('prev').onclick = () => {
            if (pageNum > 1) renderPage(--pageNum);
        };
        
        document.getElementById('next').onclick = () => {
            if (pageNum < pdfDoc.numPages) renderPage(++pageNum);
        };
