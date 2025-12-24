document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM fully loaded");

    loadHTML('header.html', 'header-placeholder');
    loadHTML('footer.html', 'footer-placeholder', initializeFooter);

    initializeVideoRotation();

    addHoverEffect('.decorative-text', 'scale(1.1)', 'scale(1)'); 
    addGlowingEffect(".welcome-text h1", ".welcome-text h2");

    initializeReceptionImages();

    setMinDateForArrivalDate();
});

function loadHTML(url, placeholderId, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(placeholderId).innerHTML = data;
            if (callback) {
             requestAnimationFrame(() => callback());
             }
})
        .catch(error => console.error(`Error loading ${url}:`, error));
}

function initializeFooter() {
    const subscribeBtn = document.querySelector('.subscribe-btn');
    const emailInput = document.querySelector('#footer-email');

    if (!subscribeBtn || !emailInput) {
        console.error("Subscribe button or email input not found.");
        return;
    }

    subscribeBtn.addEventListener('click', function (event) {
        event.preventDefault(); 
        const email = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 

        if (email && emailRegex.test(email)) {
            showToast(`Благодарим Ви! Вие се абонирахте с имейл: ${email}`);
            emailInput.value = '';
        } else {
            showToast('Моля въведете валиден e-mail!');
        }
    });
}

function initializeVideoRotation() {
    const videos = ["videos/video1.mp4", "videos/video2.mp4", "videos/video3.mp4", "videos/video4.mp4", "videos/video5.mp4"];
    const videoElement = document.getElementById("rotating-video");

    if (!videoElement) return;

    let currentVideoIndex = 0;

    function playNextVideo() {
        videoElement.pause();
        videoElement.src = videos[currentVideoIndex];
        videoElement.load(); 
        videoElement.addEventListener("canplay", () => videoElement.play(), { once: true });
        currentVideoIndex = (currentVideoIndex + 1) % videos.length; 
    }

    videoElement.addEventListener("ended", playNextVideo);
    playNextVideo(); 
}

function addHoverEffect(selector, scaleIn, scaleOut) {
    const element = document.querySelector(selector);
    if (element) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = scaleIn;
            element.style.transition = 'transform 0.3s ease-in-out';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = scaleOut;
        });
    }
}

function addGlowingEffect(selector1, selector2) {
    const h1 = document.querySelector(selector1);
    const h2 = document.querySelector(selector2);

    if (!h1 || !h2) return;

    setInterval(() => {
        h1.classList.toggle("glow");
        h2.classList.toggle("glow");
    }, 3000);
}

function initializeReceptionImages() {
    const receptionImages = document.querySelectorAll('.reception-img');
    receptionImages.forEach(image => {
        image.style.opacity = 0;
        image.style.transform = 'scale(0.9)'; 

        setTimeout(() => {
            image.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            image.style.opacity = 1;
            image.style.transform = 'scale(1)';
        }, 300); 

        image.addEventListener('mouseenter', () => {
            image.style.transform = 'scale(1.1)'; 
            image.style.opacity = 0.9; 
        });

        image.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1)'; 
            image.style.opacity = 1; 
        });
    });
}

function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function validateName(name) {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    return nameRegex.test(name);
}

function clearErrors(errorElements) {
    Object.values(errorElements).forEach(err => {
        if (err) {
            err.textContent = '';
            err.style.display = 'none';
        }
    });
}

function initializeFormHandler(formId, fields, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;

    const inputs = {};
    const errors = {};

    fields.forEach(field => {
        inputs[field.id] = form.querySelector(`#${field.id}`);
        errors[field.id] = form.querySelector(`#${field.id}-error`);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearErrors(errors);

        let hasError = false;

        fields.forEach(field => {
            const input = inputs[field.id];
            const error = errors[field.id];
            if (!input || !error) return;

            const value = field.type === 'checkbox' ? input.checked : input.value.trim();

            if (field.required && (value === '' || value === false)) {
                error.textContent = field.message;
                error.style.display = 'block';
                hasError = true;
                return;
            }

            if (field.required && (value === '' || value === false)) {
                error.textContent = field.message;  
                error.style.display = 'block';
                hasError = true;
                return;
            }

            if (field.type === 'email' && value && !validateEmail(value)) {
                error.textContent = 'Моля въведете валиден e-mail.';  
                error.style.display = 'block';
                hasError = true;
                return;
            }

            if (['name', 'first-name', 'middle-name', 'last-name'].includes(field.id) && value) {
                if (!validateName(value)) {
                    error.textContent = 'Моля въведете валидно име (само букви, интервали и тирета).';
                    error.style.display = 'block';
                    hasError = true;
                    return;
                }
            }

            if ((field.min !== undefined || field.max !== undefined) && value !== '') {
    const numericValue = Number(input.value);

    if (isNaN(numericValue)) {
        error.textContent = 'Моля въведете валидна числова стойност.';
        error.style.display = 'block';
        hasError = true;
        return;
    }

    if (field.min !== undefined && numericValue < field.min) {
        error.textContent = field.minMessage || `Минималната стойност е ${field.min}.`;
        error.style.display = 'block';
        hasError = true;
        return;
    }

    if (field.max !== undefined && numericValue > field.max) {
        error.textContent = field.maxMessage || `Максималната стойност е ${field.max}.`;
        error.style.display = 'block';
        hasError = true;
        return;
    }
}
        });

        if (!hasError) {
            showToast(successMessage);
            form.reset();
        }
    });
}


initializeFormHandler('contact-form', [
    { id: 'name', required: true, message: 'Моля въведете вашето име.' },
    { id: 'email', required: true, type: 'email', message: 'Моля въведете вашия e-mail.' },
    { id: 'message', required: true, message: 'Моля въведете съобщение.' },
    { id: 'privacy', required: true, type: 'checkbox', message: 'Необходимо е съгласие с политиката за поверителност.' }
], 'Вашето съобщение е изпратено успешно!');

initializeFormHandler('reservation-form', [
    { id: 'first-name', required: true, message: 'Моля въведете собствено име.' },
    { id: 'middle-name', required: true, message: 'Моля въведете презиме.' },
    { id: 'last-name', required: true, message: 'Моля въведете фамилия.' },
    { id: 'email', required: true, type: 'email', message: 'Моля въведете e-mail.' },
    { id: 'phone', required: true, message: 'Моля въведете телефон.' },
    { id: 'arrival-date', required: true, message: 'Моля изберете дата на пристигане.' },
    { id: 'arrival-time', required: true, message: 'Моля изберете час на пристигане.' },
        {
        id: 'nights',
        required: true,
        min: 1,
        max: 30,
        message: 'Моля въведете брой нощувки.',
        minMessage: 'Броят нощувки трябва да е поне 1.',
        maxMessage: 'Броят нощувки не може да надвишава 30.'
    },
    {
        id: 'adults',
        required: true,
        min: 1,
        max: 100,
        message: 'Моля въведете брой възрастни.',
        minMessage: 'Поне един възрастен е необходим.',
        maxMessage: 'Максималният брой възрастни е 100.'
    },
    {
        id: 'children',
        required: false,
        min: 0,
        max: 100,
        message: '',
        minMessage: 'Броят деца не може да бъде отрицателен.',
        maxMessage: 'Максималният брой деца е 100.'
    },
    { id: 'nights', required: true, min: 1, message: 'Моля въведете брой нощувки.', minMessage: 'Броят нощувки трябва да е поне 1.' },
    { id: 'room-type', required: true, message: 'Моля изберете вид резервация.' },
    { id: 'adults', required: true, min: 1, message: 'Моля въведете брой възрастни.', minMessage: 'Поне един възрастен е необходим.' },
    { id: 'children', required: false, min: 0, message: '', minMessage: 'Броят деца не може да бъде отрицателен.' },
    { id: 'agree-terms', required: true, type: 'checkbox', message: 'Трябва да сте съгласен с политиката на хотела.' },
], 'Вашата резервация е направена успешно! Благодарим Ви!');



function setMinDateForArrivalDate() {
    const input = document.getElementById('arrival-date');
    if (!input) return;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    input.min = `${yyyy}-${mm}-${dd}`;

    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const maxYyyy = nextYear.getFullYear();
    const maxMm = String(nextYear.getMonth() + 1).padStart(2, '0');
    const maxDd = String(nextYear.getDate()).padStart(2, '0');

    input.max = `${maxYyyy}-${maxMm}-${maxDd}`;
}