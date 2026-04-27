// podpiska.js — с сохранением в localStorage
(function() {
    const subscribeModal = document.getElementById('subscribeModal');
    const subscribeOpenBtn = document.querySelector('.button4');
    const subscribeCloseSpan = document.querySelector('.close-subscribe');
    
    if (!subscribeModal) return;
    
    const nameInput = document.getElementById('subName');
    const emailInput = document.getElementById('subEmail');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const submitBtn = document.getElementById('submitSubscribe');
    const successDiv = document.getElementById('formSuccessMessage');
    
    const STORAGE_KEY = 'subscribers';
    
    function getSubscribers() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch(e) {
            return [];
        }
    }
    
    function saveSubscriber(name, email) {
        const subscribers = getSubscribers();
        const alreadyExists = subscribers.some(sub => sub.email === email);
        if (alreadyExists) {
            return false;
        }
        subscribers.push({
            name: name.trim(),
            email: email.trim(),
            subscribedAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
        return true;
    }
    
    function logSubscribersCount() {
        const count = getSubscribers().length;
        console.log(`📋 Всего подписчиков в localStorage: ${count}`);
    }
    
    function isNameValidForProgress() {
        return nameInput.value.trim().length > 0;
    }
    function isEmailValidForProgress() {
        const email = emailInput.value.trim();
        if (email === '') return false;
        const atIndex = email.indexOf('@');
        if (atIndex === -1) return false;
        const dotAfterAt = email.indexOf('.', atIndex);
        return dotAfterAt !== -1 && dotAfterAt > atIndex + 1;
    }
    function updateProgressBar() {
        let filled = 0;
        if (isNameValidForProgress()) filled++;
        if (isEmailValidForProgress()) filled++;
        let percent = Math.floor((filled / 2) * 100);
        progressFill.style.width = percent + '%';
        progressPercent.innerText = percent + '%';
    }
    function validateForm() {
        let isValid = true;
        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        if (nameVal === '' || nameVal.length < 2) {
            nameError.innerText = 'Пожалуйста, введите корректное имя (не менее 2 букв)';
            isValid = false;
        } else {
            nameError.innerText = '';
        }
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            emailError.innerText = 'Введите действительный email (пример: name@domain.ru)';
            isValid = false;
        } else {
            emailError.innerText = '';
        }
        return isValid;
    }
    
    nameInput.addEventListener('input', () => {
        updateProgressBar();
        if (nameInput.value.trim().length >= 2) nameError.innerText = '';
        else if (nameInput.value.trim().length > 0 && nameInput.value.trim().length < 2) {
            nameError.innerText = 'Минимум 2 символа';
        }
    });
    emailInput.addEventListener('input', () => {
        updateProgressBar();
        if (emailInput.value.trim() !== '') emailError.innerText = '';
    });
    
    submitBtn.addEventListener('click', () => {
        if (validateForm()) {
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            
            const saved = saveSubscriber(name, email);
            if (!saved) {
                successDiv.innerHTML = '<div class="success-msg" style="background:#f0cfb0; color:#a3411a;">⚠️ Этот email уже подписан! Спасибо за интерес.</div>';
                setTimeout(() => {
                    successDiv.innerHTML = '';
                    subscribeModal.classList.remove('show');
                }, 2000);
                return;
            }
            
            logSubscribersCount(); 
            
            successDiv.innerHTML = '<div class="success-msg">✅ Спасибо! Вы подписаны на новости. Данные сохранены.</div>';
            nameInput.value = '';
            emailInput.value = '';
            updateProgressBar();
            setTimeout(() => {
                successDiv.innerHTML = '';
                subscribeModal.classList.remove('show');
            }, 2000);
        } else {
            successDiv.innerHTML = '<div style="color:#b5512e; margin-top:8px;">❌ Проверьте правильность заполнения полей</div>';
            setTimeout(() => {
                if (successDiv.innerHTML.includes('Проверьте')) successDiv.innerHTML = '';
            }, 3000);
        }
    });
    
    subscribeOpenBtn.addEventListener('click', () => {
        nameError.innerText = '';
        emailError.innerText = '';
        successDiv.innerHTML = '';
        updateProgressBar();
        subscribeModal.classList.add('show');
    });
    subscribeCloseSpan.addEventListener('click', () => {
        subscribeModal.classList.remove('show');
    });
    subscribeModal.addEventListener('click', (e) => {
        if (e.target === subscribeModal) subscribeModal.classList.remove('show');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && subscribeModal.classList.contains('show')) {
            subscribeModal.classList.remove('show');
        }
    });
    
    updateProgressBar();
    
    console.log('Текущее число подписчиков:', getSubscribers().length);
})();