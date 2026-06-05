export class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Caracteres Matrix (Katakana + Latin + Num)
    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    this.alphabet = katakana + latin + nums;

    this.fontSize = 16;
    this.columns = this.canvas.width / this.fontSize;
    
    this.drops = [];
    for(let x = 0; x < this.columns; x++) {
      this.drops[x] = 1;
    }

    this.speedMultiplier = 1;
    this.isAwakening = false;
    this.animationId = null;

    // Escuchar resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.columns = this.canvas.width / this.fontSize;
      this.drops = [];
      for(let x = 0; x < this.columns; x++) {
        this.drops[x] = 1;
      }
    });
  }

  draw() {
    // Fondo semi-transparente para el rastro
    if (this.isAwakening) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Brillo blanco en el despertar
    } else {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    }
    
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = this.isAwakening ? '#FFF' : '#0F0'; 
    this.ctx.font = this.fontSize + 'px monospace';

    // Para efecto de Glow nativo del canvas
    this.ctx.shadowBlur = this.isAwakening ? 20 : 5;
    this.ctx.shadowColor = this.isAwakening ? '#FFF' : '#0F0';

    for(let i = 0; i < this.drops.length; i++) {
      const text = this.alphabet.charAt(Math.floor(Math.random() * this.alphabet.length));
      this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

      if(this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }

      this.drops[i] += this.speedMultiplier;
    }

    this.ctx.shadowBlur = 0; // reset
  }

  start() {
    const loop = () => {
      this.draw();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  triggerAwakening() {
    this.isAwakening = true;
    this.speedMultiplier = 5; // Acelera
  }

  stopAwakening() {
    this.isAwakening = false;
    this.speedMultiplier = 1; // Vuelve a la normalidad
  }
}
