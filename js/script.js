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

// ==============================================
// HERO SLIDESHOW (Swiper.js) - Tambahan untuk background berubah-ubah
// ==============================================

document.addEventListener('DOMContentLoaded', function () {
    // Pastikan Swiper sudah ter-load dari CDN
    if (typeof Swiper === 'undefined') {
        console.error('Swiper.js belum ter-load. Pastikan CDN-nya sudah ditambahkan di HTML!');
        return;
    }

    const heroSwiper = new Swiper('.hero-swiper', {
        // Efek paling cocok untuk wedding: fade lembut & elegan
        effect: 'fade',
        fadeEffect: {
            crossFade: true   // Membuat transisi mulus tanpa flicker
        },

        loop: true,           // Slide akan berputar terus (setelah slide terakhir kembali ke awal)
        speed: 1500,          // Durasi transisi 1.5 detik → terasa romantis & tidak terburu-buru

        autoplay: {
            delay: 3000,                // Ganti foto setiap 5 detik
            disableOnInteraction: false, // Tetap autoplay meskipun user swipe
            pauseOnMouseEnter: true      // Pause sementara saat hover (bagus di desktop)
        },

        // Tampilkan 1 slide sekaligus (wajib untuk fade)
        slidesPerView: 1,
        spaceBetween: 0,

        // Pagination (titik-titik kecil di bawah gambar) → optional tapi cantik
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            type: 'bullets',
        },

        // Panah kiri-kanan → optional, bisa di-uncomment kalau mau
        // navigation: {
        //     nextEl: '.swiper-button-next',
        //     prevEl: '.swiper-button-prev',
        // },
    });

    console.log('Hero Swiper berhasil diinisialisasi!');
});

// ==============================================
// BACKGROUND MUSIC AUTOPLAY + MUTE/UNMUTE CONTROL
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    // === ELEMEN COVER & MUSIK ===
    const coverPage = document.getElementById('coverPage');
    const openInvitationBtn = document.getElementById('openInvitationBtn');
    const audio = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const playIcon = document.getElementById('musicPlayIcon');
    const muteIcon = document.getElementById('musicMuteIcon');
    const guestName = document.getElementById('guestName');

    // === ELEMEN MODAL PESAN ===
    const openMessageBtn = document.getElementById('openMessageBtn');
    const closeModal = document.getElementById('closeModal');
    const messageModal = document.getElementById('messageModal');
    const messageForm = document.getElementById('messageForm');

    // 1. INISIALISASI AWAL
    document.body.style.overflow = 'hidden'; // Kunci scroll saat cover ada
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.4;
    }

    // 2. AMBIL NAMA TAMU DARI URL (?to=Nama+Tamu)
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('to');
    if (nameParam && guestName) {
        guestName.textContent = nameParam;
    }

    // 3. FUNGSI UPDATE IKON MUSIK
    function updateMusicIcons() {
        if (audio.paused) {
            playIcon.classList.add('hidden');
            muteIcon.classList.remove('hidden');
        } else {
            playIcon.classList.remove('hidden');
            muteIcon.classList.add('hidden');
        }
    }

    // 4. LOGIKA BUKA UNDANGAN (Cover Bergeser & Musik Play)
    if (openInvitationBtn) {
        openInvitationBtn.addEventListener('click', function() {
            // Animasi Cover Keluar
            if (coverPage) {
                coverPage.style.transition = 'transform 1s ease-in-out';
                coverPage.style.transform = 'translateY(-100%)';
                document.body.style.overflow = 'auto'; // Buka kunci scroll
                
                setTimeout(() => {
                    coverPage.style.display = 'none';
                }, 1000);
            }

            // Putar Musik
            if (audio) {
                audio.play().then(() => updateMusicIcons()).catch(err => console.log(err));
            }
        });
    }

    // 5. LOGIKA TOMBOL MUTE/PLAY (Floating Button)
    if (musicToggle) {
        musicToggle.addEventListener('click', function() {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
            updateMusicIcons();
        });
    }

    // 6. LOGIKA MODAL PESAN
    if (openMessageBtn) {
        openMessageBtn.addEventListener('click', () => messageModal.classList.remove('hidden'));
    }
    if (closeModal) {
        closeModal.addEventListener('click', () => messageModal.classList.add('hidden'));
    }

    // 7. SUBMIT FORM KE GOOGLE SHEETS
    if (messageForm) {
        messageForm.addEventListener('submit', e => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            
            fetch(scriptURL, { method: 'POST', body: new FormData(messageForm)})
            .then(res => {
                alert('Pesan terkirim!');
                messageForm.reset();
                messageModal.classList.add('hidden');
                submitBtn.disabled = false;
            })
            .catch(err => console.error(err));
        });
    }

    // 8. INISIALISASI SWIPER
    if (typeof Swiper !== 'undefined') {
        new Swiper('.hero-swiper', {
            effect: 'fade',
            loop: true,
            autoplay: { delay: 3000 },
            speed: 1500
        });
    }
});