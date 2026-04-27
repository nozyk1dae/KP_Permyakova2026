(function() {
           
            const container = document.getElementById('dustFxContainer');
            if (!container) return;
            
            // Настройки эффекта
            const CONFIG = {
                particlesPerMove: 4,        
                maxParticlesOnScreen: 280,   
                baseLifetime: 800,           
                driftRange: 32,              
                baseSize: { min: 2, max: 7 }, 
                colors: [
                    'rgba(195, 165, 105, 0.7)',   
                    'rgba(170, 135, 85, 0.65)',   
                    'rgba(140, 100, 60, 0.6)',    
                    'rgba(210, 185, 135, 0.7)',  
                    'rgba(120, 85, 50, 0.55)',    
                    'rgba(200, 170, 120, 0.6)'    
                ],
                extraGlow: true                 
            };
            
            let activeParticlesCount = 0;
            let animationFrameReq = null;
            let lastMoveTime = 0;
            let throttleDelay = 12; 
            function randomRange(min, max) {
                return min + Math.random() * (max - min);
            }
            
           
            function createDustParticle(clientX, clientY) {
                
                if (activeParticlesCount > CONFIG.maxParticlesOnScreen) return null;
                
                
                const size = randomRange(CONFIG.baseSize.min, CONFIG.baseSize.max);
             
                const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
                
                const spreadX = (Math.random() - 0.5) * 16;
                const spreadY = (Math.random() - 0.5) * 12;
                const left = clientX + spreadX;
                const top = clientY + spreadY;
                
              
                const driftX = (Math.random() - 0.5) * CONFIG.driftRange * 1.3;
                const driftY = (Math.random() - 0.5) * CONFIG.driftRange * 0.9 + (Math.random() * 8 - 4); // плюс лёгкая вертикаль
                
             
                const randomAngle = Math.random() * 360;
                
             
                const lifetime = randomRange(CONFIG.baseLifetime * 0.65, CONFIG.baseLifetime * 1.25);
                
         
                const particle = document.createElement('div');
                particle.className = 'dust-particle';
                
                particle.style.position = 'absolute';
                particle.style.left = left + 'px';
                particle.style.top = top + 'px';
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.borderRadius = '50%';
                particle.style.backgroundColor = color;
                particle.style.boxShadow = CONFIG.extraGlow ? `0 0 2px rgba(180, 140, 80, 0.4)` : 'none';
                particle.style.pointerEvents = 'none';
                particle.style.willChange = 'transform, opacity';
                
                particle.style.backdropFilter = `blur(0.4px)`;
                particle.style.opacity = '0.92';
                
                particle.style.transition = `transform ${lifetime}ms cubic-bezier(0.2, 0.9, 0.3, 1.1), opacity ${lifetime * 0.9}ms ease-out`;
                
                container.appendChild(particle);
                activeParticlesCount++;
                particle.getBoundingClientRect();
                
                const finalScale = randomRange(0.05, 0.35);
                const finalTransform = `translate(${driftX}px, ${driftY}px) rotate(${randomAngle}deg) scale(${finalScale})`;
                particle.style.transform = finalTransform;
                particle.style.opacity = '0';
                
                const removeParticle = () => {
                    if (particle && particle.parentNode) {
                        particle.removeEventListener('transitionend', removeParticle);
                        particle.remove();
                        activeParticlesCount--;
                    }
                };
                
                particle.addEventListener('transitionend', removeParticle, { once: true });
                setTimeout(() => {
                    if (particle && particle.parentNode) {
                        particle.remove();
                        activeParticlesCount--;
                    }
                }, lifetime + 100);
                
                return particle;
            }
            let lastExecTime = 0;
            let pendingMove = null;
            
            function handleMouseMove(e) {
                const now = Date.now();
                if (now - lastExecTime < throttleDelay) {
                    if (pendingMove === null) {
                        pendingMove = setTimeout(() => {
                            generateParticles(e.clientX, e.clientY);
                            lastExecTime = Date.now();
                            pendingMove = null;
                        }, throttleDelay);
                    }
                    return;
                }
                generateParticles(e.clientX, e.clientY);
                lastExecTime = now;
                if (pendingMove) {
                    clearTimeout(pendingMove);
                    pendingMove = null;
                }
            }
            function generateParticles(x, y) {
                if (x === undefined || y === undefined) return;
                if (x < 0 || y < 0) return;
                let count = CONFIG.particlesPerMove;
                count = Math.floor(randomRange(2.5, 6.5));
                
                for (let i = 0; i < count; i++) {
                    createDustParticle(x, y);
                }
            }
            function onClickDust(e) {
                for (let i = 0; i < 12; i++) {
                    setTimeout(() => {
                        createDustParticle(e.clientX + (Math.random() - 0.5) * 18, e.clientY + (Math.random() - 0.5) * 18);
                    }, i * 12);
                }
            }
            
            function initDustEffect() {
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('click', onClickDust);с
                window.addEventListener('touchmove', (e) => {
                    if (e.touches.length) {
                        const touch = e.touches[0];
                        handleMouseMove(touch);
                    }
                }, { passive: true });
                window.addEventListener('touchstart', (e) => {
                    if (e.touches.length) {
                        const touch = e.touches[0];
                        onClickDust(touch);
                        generateParticles(touch.clientX, touch.clientY);
                    }
                });
            }
            
            const styleNode = document.createElement('style');
            styleNode.textContent = `
                .dust-particle {
                    position: fixed;
                    border-radius: 50%;
                    pointer-events: none;
                    user-select: none;
                    will-change: transform, opacity;
                    mix-blend-mode: multiply;
                    filter: blur(0.3px);
                    backface-visibility: hidden;
                    z-index: 2147483647;
                }
                /* Лёгкое затемнение для эффекта старины */
                @media (prefers-reduced-motion: no-preference) {
                    .dust-particle {
                        transition-timing-function: cubic-bezier(0.15, 0.9, 0.25, 1.1);
                    }
                }
            `;
            document.head.appendChild(styleNode);
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initDustEffect);
            } else {
                initDustEffect();
            }
            
            setInterval(() => {
                const allParticles = document.querySelectorAll('.dust-particle');
                if (allParticles.length > CONFIG.maxParticlesOnScreen + 50) {
                    const excess = allParticles.length - CONFIG.maxParticlesOnScreen;
                    for (let i = 0; i < Math.min(excess, 30); i++) {
                        if (allParticles[i] && allParticles[i].parentNode) {
                            allParticles[i].remove();
                            activeParticlesCount--;
                        }
                    }
                }
            }, 30000);
            
            function enhanceHoverDust() {
                const cards = document.querySelectorAll('.photo-card, .chtez, .budilsh');
                cards.forEach(el => {
                    el.addEventListener('mouseenter', (e) => {
                        const rect = el.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        for (let i = 0; i < 8; i++) {
                            setTimeout(() => {
                                createDustParticle(
                                    centerX + (Math.random() - 0.5) * rect.width * 0.7,
                                    centerY + (Math.random() - 0.5) * rect.height * 0.6
                                );
                            }, i * 18);
                        }
                    });
                });
            }
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', enhanceHoverDust);
            } else {
                enhanceHoverDust();
            }
            
            window.getActiveDustCount = () => activeParticlesCount;
        })();