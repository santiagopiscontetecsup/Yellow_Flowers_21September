class SunflowerDrawer {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.config = {
            centerX: options.centerX || this.canvas.width / 2,
            centerY: options.centerY || this.canvas.height / 2,
            petalCount: options.petalCount || 13,
            petalLength: options.petalLength || 60,
            petalWidth: options.petalWidth || 25,
            centerRadius: options.centerRadius || 25,
            animationSpeed: options.animationSpeed || 100,
            colors: {
                petals: options.petalColor || '#FFD700',
                petalGradient: options.petalGradient || '#FFA500',
                center: options.centerColor || '#8B4513',
                centerSeeds: options.seedColor || '#654321'
            }
        };
        
        this.animationState = {
            currentPetal: 0,
            centerDrawn: false,
            seedsDrawn: false,
            isAnimating: false
        };
        
        this.setupCanvas();
    }
    
    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.config.centerX = rect.width / 2;
        this.config.centerY = rect.height / 2;
    }
    
    drawPetal(angle, progress = 1) {
        this.ctx.save();
        
        this.ctx.translate(this.config.centerX, this.config.centerY);
        this.ctx.rotate(angle);
        
        const gradient = this.ctx.createLinearGradient(0, 0, 0, -this.config.petalLength);
        gradient.addColorStop(0, this.config.colors.center);
        gradient.addColorStop(0.3, this.config.colors.petals);
        gradient.addColorStop(1, this.config.colors.petalGradient);
        
        this.ctx.fillStyle = gradient;
        this.ctx.strokeStyle = '#DAA520';
        this.ctx.lineWidth = 1;
        
        this.ctx.beginPath();
        
        const length = this.config.petalLength * progress;
        const width = this.config.petalWidth * progress;
        
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(
            -width/3, -length/3,
            -width/2, -length*0.7,
            0, -length
        );
        this.ctx.bezierCurveTo(
            width/2, -length*0.7,
            width/3, -length/3,
            0, 0
        );
        
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, -length);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawCenter(progress = 1) {
        const radius = this.config.centerRadius * progress;
        
        const gradient = this.ctx.createRadialGradient(
            this.config.centerX, this.config.centerY, 0,
            this.config.centerX, this.config.centerY, radius
        );
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(0.5, '#654321');
        gradient.addColorStop(1, '#4A2C17');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.config.centerX, this.config.centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#2F1B14';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawSeeds(progress = 1) {
        const maxSeeds = Math.floor(40 * progress);
        const centerRadius = this.config.centerRadius * 0.8;
        
        const goldenAngle = Math.PI * (3 - Math.sqrt(5)); 
        
        this.ctx.fillStyle = this.config.colors.centerSeeds;
        
        for (let i = 0; i < maxSeeds; i++) {
            const angle = i * goldenAngle;
            const radius = Math.sqrt(i) * 2.5;
            
            if (radius > centerRadius) continue;
            
            const x = this.config.centerX + radius * Math.cos(angle);
            const y = this.config.centerY + radius * Math.sin(angle);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawComplete() {
        this.clear();
        
        for (let i = 0; i < this.config.petalCount; i++) {
            const angle = (i / this.config.petalCount) * Math.PI * 2;
            this.drawPetal(angle);
        }
        
        this.drawCenter();
        this.drawSeeds();
    }
    
    animateAssembly() {
        if (this.animationState.isAnimating) return;
        
        this.animationState.isAnimating = true;
        this.animationState.currentPetal = 0;
        this.animationState.centerDrawn = false;
        this.animationState.seedsDrawn = false;
        
        this.clear();
        
        const animateStep = () => {
            if (this.animationState.currentPetal < this.config.petalCount) {
                const angle = (this.animationState.currentPetal / this.config.petalCount) * Math.PI * 2;
                
                let growth = 0;
                const growPetal = () => {
                    this.clear();
                    
                    for (let i = 0; i < this.animationState.currentPetal; i++) {
                        const prevAngle = (i / this.config.petalCount) * Math.PI * 2;
                        this.drawPetal(prevAngle);
                    }
                    
                    if (growth <= 1) {
                        this.drawPetal(angle, growth);
                        growth += 0.1;
                        requestAnimationFrame(growPetal);
                    } else {
                        this.animationState.currentPetal++;
                        setTimeout(animateStep, this.config.animationSpeed);
                    }
                };
                
                growPetal();
                
            } else if (!this.animationState.centerDrawn) {
                let centerGrowth = 0;
                const growCenter = () => {
                    this.clear();
                    
                    for (let i = 0; i < this.config.petalCount; i++) {
                        const angle = (i / this.config.petalCount) * Math.PI * 2;
                        this.drawPetal(angle);
                    }
                    
                    if (centerGrowth <= 1) {
                        this.drawCenter(centerGrowth);
                        centerGrowth += 0.05;
                        requestAnimationFrame(growCenter);
                    } else {
                        this.animationState.centerDrawn = true;
                        setTimeout(animateStep, this.config.animationSpeed);
                    }
                };
                
                growCenter();
                
            } else if (!this.animationState.seedsDrawn) {
                let seedGrowth = 0;
                const growSeeds = () => {
                    this.clear();
                    
                    for (let i = 0; i < this.config.petalCount; i++) {
                        const angle = (i / this.config.petalCount) * Math.PI * 2;
                        this.drawPetal(angle);
                    }
                    this.drawCenter();
                    
                    if (seedGrowth <= 1) {
                        this.drawSeeds(seedGrowth);
                        seedGrowth += 0.02;
                        requestAnimationFrame(growSeeds);
                    } else {
                        this.animationState.seedsDrawn = true;
                        this.animationState.isAnimating = false;
                        
                        this.addFinalEffects();
                    }
                };
                
                growSeeds();
            }
        };
        
        animateStep();
    }
    
    addFinalEffects() {
        this.ctx.save();
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#FFD700';
        this.drawComplete();
        this.ctx.restore();
        
        this.canvas.dispatchEvent(new CustomEvent('sunflowerComplete', {
            detail: { drawer: this }
        }));
    }
    
    resize() {
        this.setupCanvas();
        this.drawComplete();
    }
    
    updateColors(newColors) {
        Object.assign(this.config.colors, newColors);
        if (!this.animationState.isAnimating) {
            this.drawComplete();
        }
    }
    
    setupInteractivity() {
        this.canvas.addEventListener('click', () => {
            this.animateAssembly();
        });
        
        this.canvas.addEventListener('mouseenter', () => {
            this.canvas.style.cursor = 'pointer';
            this.canvas.style.transform = 'scale(1.05)';
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.canvas.style.cursor = 'default';
            this.canvas.style.transform = 'scale(1)';
        });
    }
}

function createSunflowerGarden(containerId, count = 3) {
    const container = document.getElementById(containerId);
    const sunflowers = [];
    
    for (let i = 0; i < count; i++) {
        const canvas = document.createElement('canvas');
        canvas.id = `sunflower-${i}`;
        canvas.width = 200;
        canvas.height = 200;
        canvas.style.margin = '10px';
        canvas.style.borderRadius = '50%';
        canvas.style.transition = 'transform 0.3s ease';
        
        container.appendChild(canvas);
        
        const drawer = new SunflowerDrawer(`sunflower-${i}`, {
            petalCount: 8 + Math.floor(Math.random() * 8),
            animationSpeed: 50 + Math.random() * 100
        });
        
        drawer.setupInteractivity();
        sunflowers.push(drawer);
        
        setTimeout(() => {
            drawer.animateAssembly();
        }, i * 1000 + Math.random() * 500);
    }
    
    return sunflowers;
}

window.SunflowerDrawer = SunflowerDrawer;
window.createSunflowerGarden = createSunflowerGarden;