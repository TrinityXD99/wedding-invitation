const scriptURL = 'https://script.google.com/macros/s/AKfycbwbdx7nTik6nofMkxyOwNlXppeEN90wLXbC17X27HStWpcj-XkBFRoNxBalxv9myMFs/exec';

// Ambil semua elemen yang dibutuhkan
const openBtn      = document.getElementById('openMessageBtn');
const closeBtn     = document.getElementById('closeModal');
const modal        = document.getElementById('messageModal');
const form         = document.getElementById('messageForm');
const submitBtn    = document.getElementById('submitBtn');
const submitText   = document.getElementById('submitText');
const submitLoading = document.getElementById('submitLoading');
const formMessage  = document.getElementById('formMessage');

// Cek apakah elemen ditemukan (debug awal)
console.log('Open Button:', openBtn);
console.log('Modal:', modal);
console.log('Form:', form);

if (!openBtn || !modal) {
    console.error('Elemen modal atau tombol tidak ditemukan! Cek ID di HTML.');
}

// Buka modal
if (openBtn) {
    openBtn.addEventListener('click', () => {
        console.log('Tombol Tinggalkan Pesan diklik');
        modal.classList.remove('hidden');
    });
}

// Tutup modal
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        console.log('Tombol close diklik');
        modal.classList.add('hidden');
    });
}

// Submit form
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form sedang disubmit...');

        // Tampilkan loading
        submitText.classList.add('hidden');
        submitLoading.classList.remove('hidden');
        submitBtn.disabled = true;

        fetch(scriptURL, {
            method: 'POST',
            body: new FormData(form)
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(() => {
            console.log('Pesan berhasil terkirim!');
            formMessage.classList.remove('hidden');
            form.reset();

            setTimeout(() => {
                modal.classList.add('hidden');
                formMessage.classList.add('hidden');
                submitText.classList.remove('hidden');
                submitLoading.classList.add('hidden');
                submitBtn.disabled = false;
            }, 3000);
        })
        .catch(error => {
            console.error('Error saat mengirim:', error);
            formMessage.textContent = 'Maaf, gagal mengirim pesan. Coba lagi ya!';
            formMessage.classList.remove('hidden', 'text-green-600');
            formMessage.classList.add('text-red-600');

            setTimeout(() => {
                formMessage.classList.add('hidden');
                formMessage.textContent = 'Terima kasih! Pesan Anda sudah terkirim.';
                formMessage.classList.remove('text-red-600');
                formMessage.classList.add('text-green-600');
                submitText.classList.remove('hidden');
                submitLoading.classList.add('hidden');
                submitBtn.disabled = false;
            }, 4000);
        });
    });
}