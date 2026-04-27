
        const modal = document.getElementById('afishaModal');
        const btn = document.querySelector('.button2');
        const closeSpan = document.querySelector('.close-modal');

        btn.addEventListener('click', () => {
            modal.classList.add('show');
        });

        closeSpan.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
        });