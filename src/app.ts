interface Drawable {
  draw(ctx: CanvasRenderingContext2D): any;
}

class Position {
  constructor(public x: number, public y: number) {}
}

class Particle extends Position implements Drawable {
  velocity: Position = {
    x: (Math.random() - 0.5) * 5,
    y: (Math.random() - 0.5) * 5,
  };

  constructor(x: number, y: number, public readonly radius: number) {
    super(x, y);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.updateVelocity(ctx.canvas.width, ctx.canvas.height);

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }

  private updateVelocity (canvasWidth: number, canvasHeight: number) {
    if (this.x + this.radius > canvasWidth || this.x - this.radius < 0)
      this.velocity.x = -this.velocity.x;
    if (this.y + this.radius > canvasHeight || this.y - this.radius < 0)
      this.velocity.y = -this.velocity.y;
  }
}

export class App {
  private readonly ctx: CanvasRenderingContext2D;
  private raf: number;
  private continueAnimating = true;

  private mousePosition = new Position(-100, -100);
  private particles: Particle[] = [];

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d');

    this.canvas.addEventListener('mousemove', (e) => {
      this.calculateMouseRelativePositionInCanvas(e);
    });

    this.canvas.addEventListener('mouseenter', () => {
      this.raf = window.requestAnimationFrame(() => this.animate());
      this.continueAnimating = true;
    });

    this.canvas.addEventListener('mouseout', () => {
      window.cancelAnimationFrame(this.raf);
      this.continueAnimating = false; // stop animation when mouse out.
    });
  }

  draw() {
    this.drawBackground();

    const radius = 24;
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * (this.canvas.width - radius * 2) + radius,
        y = Math.random() * (this.canvas.height - radius * 2) + radius;

      let p = new Particle(x, y, radius);
      this.particles.push(p);
    }

    this.animate();
  }

  private drawBackground() {
    this.ctx.fillStyle = '#333';
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fill();
  }

  private animate() {
    if (!this.continueAnimating) {
      return; // nothing needs to be animated
    }

    this.drawBackground();

    this.particles.forEach((p) => {
      p.draw(this.ctx);
    });

    window.requestAnimationFrame(() => this.animate());
  }

  private calculateMouseRelativePositionInCanvas(e: MouseEvent) {
    this.mousePosition.x =
      e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - this.canvas.offsetLeft;
    this.mousePosition.y =
      e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - this.canvas.offsetTop;
  }
}
