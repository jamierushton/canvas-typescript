class Position {
  constructor(public x: number, public y: number) {}
}

export class App {
  private readonly ctx: CanvasRenderingContext2D;
  private raf: number;
  private continueAnimating = true;

  private mousePosition = new Position(-100, -100);

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d');

    this.canvas.addEventListener('mousemove', e => {
      this.calculateMouseRelativePositionInCanvas(e);
    });

    this.canvas.addEventListener('mouseenter', () => {
      this.raf = window.requestAnimationFrame(() => this.animate());
      this.continueAnimating = true;
    });

    this.canvas.addEventListener('mouseout', () => {
      window.cancelAnimationFrame(this.raf);
      this.continueAnimating = false;  // stop animation when mouse out.
    });
  }

  draw() {
    this.drawBackground();

    //

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

    //

    window.requestAnimationFrame(() => this.animate());
  }

  private calculateMouseRelativePositionInCanvas(e: MouseEvent) {
    this.mousePosition.x =
      e.clientX +
      (document.documentElement.scrollLeft || document.body.scrollLeft) -
      this.canvas.offsetLeft;
    this.mousePosition.y =
      e.clientY +
      (document.documentElement.scrollTop || document.body.scrollTop) -
      this.canvas.offsetTop;
  }
}
