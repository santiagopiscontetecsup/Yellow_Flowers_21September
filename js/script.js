document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    createFallingPetals();
    setupInteractiveFlowers();
    addMouseTrailEffect();
    setupParallaxEffect();
    initializeSunflower(); 
});

function initializeSunflower() {
    const sunflowerDrawer = new SunflowerDrawer('main-sunflower', {
        petalCount: 12,
        petalLength: 45,
        petalWidth: 20,
        centerRadius: 20,
        animationSpeed: 80,
        colors: {
            petals: '#FFD700',
            petalGradient: '#FFA500',
            center: '#8B4513',
            centerSeeds: '#654321'
        }
    });
    
    const drawButton = document.getElementById('draw-sunflower');
    drawButton.addEventListener('click', function() {
        sunflowerDrawer.animateAssembly();
        
        const originalText = this.textContent;
        this.textContent = '🎨 Dibujando...';
        this.disabled = true;
        
        const sunflowerCanvas = document.getElementById('main-sunflower');
        sunflowerCanvas.addEventListener('sunflowerComplete', function() {
            drawButton.textContent = '🌻 Redibujar Girasol';
            drawButton.disabled = false;
            
            createSunflowerCelebration();
        }, { once: true });
    });
    
    setTimeout(() => {
        sunflowerDrawer.animateAssembly();
        drawButton.textContent = '🌻 Redibujar Girasol';
    }, 2000);
    
    window.addEventListener('resize', () => {
        sunflowerDrawer.resize();
    });
}

function createSunflowerCelebration() {
    const canvas = document.getElementById('main-sunflower');
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.innerHTML = ['🌻', '🌼', '✨', '💛', '⭐', '🎉'][Math.floor(Math.random() * 6)];
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.fontSize = Math.random() * 25 + 15 + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.color = '#FFD700';
            
            const angle = (i / 20) * Math.PI * 2;
            const distance = 150 + Math.random() * 100;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            document.body.appendChild(particle);
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(1.5) rotate(720deg)`,
                    opacity: 0
                }
            ], {
                duration: 1500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                document.body.removeChild(particle);
            };
        }, i * 50);
    }
    
    const celebrationCanvas = document.getElementById('main-sunflower');
    celebrationCanvas.style.animation = 'sunflowerPulse 1s ease-out';
    setTimeout(() => {
        celebrationCanvas.style.animation = '';
    }, 1000);
}

function initializeAnimations() {
    const mainContent = document.querySelector('.main-content');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
        mainContent.style.transition = 'all 1s ease-out';
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 300);

    const flowers = document.querySelectorAll('.flower');
    flowers.forEach((flower, index) => {
        flower.style.opacity = '0';
        flower.style.transform = 'scale(0)';
        
        setTimeout(() => {
            flower.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            flower.style.opacity = '0.7';
            flower.style.transform = 'scale(1)';
        }, 500 + (index * 200));
    });
}

function createFallingPetals() {
    const container = document.querySelector('.falling-petals');
    const petalTypes = ['🌼', '🌻', '🌸', '💛', '⭐'];
    
    function createPetal() {
        const petal = document.createElement('div');
        petal.innerHTML = petalTypes[Math.floor(Math.random() * petalTypes.length)];
        petal.style.position = 'absolute';
        petal.style.fontSize = Math.random() * 20 + 10 + 'px';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.top = '-50px';
        petal.style.opacity = Math.random() * 0.7 + 0.3;
        petal.style.pointerEvents = 'none';
        petal.style.userSelect = 'none';
        petal.style.zIndex = '1';
        
        const duration = Math.random() * 3000 + 2000; 
        const rotation = Math.random() * 360;
        const sway = Math.random() * 100 - 50; 
        
        petal.style.animation = `fallDown ${duration}ms linear forwards`;
        petal.style.transform = `rotate(${rotation}deg)`;
        
        const keyframes = `
            @keyframes fallDown {
                0% {
                    transform: translateY(-50px) translateX(0px) rotate(${rotation}deg);
                    opacity: ${petal.style.opacity};
                }
                50% {
                    transform: translateY(50vh) translateX(${sway}px) rotate(${rotation + 180}deg);
                }
                100% {
                    transform: translateY(100vh) translateX(${sway * 2}px) rotate(${rotation + 360}deg);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.querySelector('#petal-styles')) {
            const style = document.createElement('style');
            style.id = 'petal-styles';
            document.head.appendChild(style);
        }
        
        container.appendChild(petal);
        
        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        }, duration);
    }
    
    setInterval(createPetal, 800);
    
    for (let i = 0; i < 5; i++) {
        setTimeout(createPetal, i * 200);
    }
}

function setupInteractiveFlowers() {
    const interactiveFlowers = document.querySelectorAll('.interactive-flower');
    
    interactiveFlowers.forEach(flower => {
        flower.addEventListener('click', function() {
            createParticleExplosion(this);
            
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
            
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 600);
        });
        
        flower.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(15deg)';
            this.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
        });
        
        flower.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = 'none';
        });
    });
}

function createParticleExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '✨';
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.fontSize = '20px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.color = '#FFD700';
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 100;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        document.body.appendChild(particle);
        
        particle.animate([
            {
                transform: 'translate(0, 0) scale(0)',
                opacity: 1
            },
            {
                transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            document.body.removeChild(particle);
        };
    }
}

function addMouseTrailEffect() {
    let mouseTrail = [];
    const trailLength = 10;
    
    document.addEventListener('mousemove', function(e) {
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.width = '8px';
        trail.style.height = '8px';
        trail.style.borderRadius = '50%';
        trail.style.background = 'radial-gradient(circle, #FFD700, #FFA500)';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '999';
        trail.style.opacity = '0.7';
        trail.style.transform = 'scale(0)';
        trail.style.transition = 'all 0.3s ease-out';
        
        document.body.appendChild(trail);
        mouseTrail.push(trail);
        
        setTimeout(() => {
            trail.style.transform = 'scale(1)';
        }, 10);
        
        if (mouseTrail.length > trailLength) {
            const oldTrail = mouseTrail.shift();
            oldTrail.style.opacity = '0';
            oldTrail.style.transform = 'scale(0)';
            setTimeout(() => {
                if (oldTrail.parentNode) {
                    oldTrail.parentNode.removeChild(oldTrail);
                }
            }, 300);
        }
    });
}

function setupParallaxEffect() {
    const flowers = document.querySelectorAll('.flower');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        flowers.forEach((flower, index) => {
            const speed = (index + 1) * 0.1;
            flower.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

window.addEventListener('scroll', function() {
    const messageCard = document.querySelector('.message-card');
    const rect = messageCard.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.top < windowHeight && rect.bottom > 0) {
        const opacity = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
        messageCard.style.opacity = opacity;
    }
});

const additionalStyles = `
    .interactive-flower.clicked {
        animation: clickPulse 0.6s ease-out;
    }
    
    @keyframes clickPulse {
        0% { transform: scale(1.2) rotate(15deg); }
        50% { transform: scale(1.4) rotate(180deg); background: rgba(255, 215, 0, 0.5); }
        100% { transform: scale(1.2) rotate(360deg); }
    }
    
    .message-card {
        transition: all 0.3s ease-out;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

window.addEventListener('load', function() {
    const title = document.querySelector('.title');
    title.style.animation = 'titleGlow 3s ease-in-out infinite alternate, titleLoad 2s ease-out';
    
    setTimeout(() => {
        createCelebrationParticles();
    }, 1000);
});

function createCelebrationParticles() {
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.innerHTML = ['🌻', '🌼', '✨', '💛', '⭐'][Math.floor(Math.random() * 5)];
            particle.style.position = 'fixed';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '100%';
            particle.style.fontSize = Math.random() * 30 + 20 + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            document.body.appendChild(particle);
            
            particle.animate([
                {
                    transform: 'translateY(0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translateY(-${window.innerHeight + 100}px) rotate(720deg)`,
                    opacity: 0
                }
            ], {
                duration: 3000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                if (particle.parentNode) {
                    document.body.removeChild(particle);
                }
            };
        }, i * 100);
    }
}