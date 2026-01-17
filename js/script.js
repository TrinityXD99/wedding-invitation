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
    const audio = document.getElementById('backgroundMusic');
    const toggleBtn = document.getElementById('musicToggle');
    const playIcon = document.getElementById('musicPlayIcon');
    const muteIcon = document.getElementById('musicMuteIcon');
    const tooltip = document.getElementById('musicTooltip');
    
    let isMuted = false;
    let hasStarted = false; // Track apakah musik sudah pernah dimulai

    // Set volume awal
    audio.volume = 0.15; // 15% volume

    // Function untuk memulai musik
    function startMusic() {
        if (!hasStarted) {
            audio.play().then(() => {
                console.log('🎵 Musik berhasil dimulai!');
                hasStarted = true;
                isMuted = false;
                updateIcon();
            }).catch(error => {
                console.log('⚠️ Gagal play musik:', error);
            });
        }
    }

    // Update icon berdasarkan status
    function updateIcon() {
        if (isMuted || audio.paused) {
            // Tampilkan icon mute
            playIcon.classList.add('hidden');
            muteIcon.classList.remove('hidden');
            tooltip.textContent = 'Nyalakan Musik';
        } else {
            // Tampilkan icon play
            playIcon.classList.remove('hidden');
            muteIcon.classList.add('hidden');
            tooltip.textContent = 'Matikan Musik';
        }
    }

    // Toggle mute/unmute saat tombol diklik
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Jika musik belum pernah dimulai, mulai dulu
        if (!hasStarted) {
            startMusic();
            return;
        }
        
        // Toggle mute/unmute
        if (isMuted) {
            // Unmute
            audio.muted = false;
            if (audio.paused) {
                audio.play();
            }
            isMuted = false;
            console.log('🔊 Musik dinyalakan');
        } else {
            // Mute
            audio.muted = true;
            isMuted = true;
            console.log('🔇 Musik di-mute');
        }
        
        updateIcon();
    });

    // Coba autoplay langsung
    setTimeout(() => {
        startMusic();
    }, 500);

    // Fallback: Coba play saat ada interaksi user
    let interactionEvents = ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'];
    
    function attemptPlayOnInteraction() {
        if (!hasStarted) {
            console.log('🎵 Mencoba play musik dari interaksi user...');
            startMusic();
        }
        
        // Hapus semua event listener setelah berhasil
        if (hasStarted) {
            interactionEvents.forEach(event => {
                document.removeEventListener(event, attemptPlayOnInteraction);
            });
        }
    }

    // Tambahkan event listener untuk berbagai jenis interaksi
    interactionEvents.forEach(event => {
        document.addEventListener(event, attemptPlayOnInteraction, { once: true, passive: true });
    });

    // Set initial icon state
    updateIcon();

    // Monitor status audio untuk update icon
    audio.addEventListener('play', function() {
        hasStarted = true;
        if (!isMuted) {
            updateIcon();
        }
    });

    audio.addEventListener('pause', function() {
        updateIcon();
    });
});

