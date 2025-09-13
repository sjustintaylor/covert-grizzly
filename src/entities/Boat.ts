export interface Position {
  x: number;
  y: number;
}

export type OrderType =
  | "NO_SPEED"
  | "HALF_SPEED"
  | "FULL_SPEED"
  | "HALF_LEFT"
  | "FULL_LEFT"
  | "HALF_RIGHT"
  | "FULL_RIGHT";

export interface Order {
  type: OrderType;
  duration: number;
  startTime: number;
}

export class Boat {
  public position: Position;
  public velocity: Position;
  public readonly width: number = 30;
  public readonly height: number = 60;
  public currentOrder: Order | null = null;
  public orderQueue: Order[] = [];

  // Physics state
  public rotation: number = 0; // angle in radians
  public angularVelocity: number = 0; // radians per second
  public currentSpeed: number = 0; // current forward speed
  public targetSpeed: number = 0; // target speed to reach

  private readonly maxSpeed: number = 100;
  private readonly maxAngularVelocity: number = 2.5; // radians per second
  private readonly speedAcceleration: number = 120; // units per second^2
  private readonly angularDamping: number = 0.85; // damping factor for angular velocity

  constructor(x: number, y: number) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
  }

  public addOrder(orderType: OrderType, duration: number = 3000): void {
    const order: Order = {
      type: orderType,
      duration,
      startTime: Date.now(),
    };
    this.orderQueue.push(order);
  }

  public update(deltaTime: number): void {
    this.processOrders();
    this.updateMovement(deltaTime);
  }

  private processOrders(): void {
    if (!this.currentOrder && this.orderQueue.length > 0) {
      this.currentOrder = this.orderQueue.shift()!;
      this.currentOrder.startTime = Date.now();
      this.applyOrder(this.currentOrder);
    }

    if (this.currentOrder) {
      const elapsed = Date.now() - this.currentOrder.startTime;
      if (elapsed >= this.currentOrder.duration) {
        // Turn orders expire and stop turning
        if (this.isTurnOrder(this.currentOrder.type)) {
          this.angularVelocity = 0;
        }
        this.currentOrder = null;
      }
    }
  }

  private applyOrder(order: Order): void {
    switch (order.type) {
      case "NO_SPEED":
        this.targetSpeed = 0;
        break;
      case "HALF_SPEED":
        this.targetSpeed = this.maxSpeed * 0.5;
        break;
      case "FULL_SPEED":
        this.targetSpeed = this.maxSpeed;
        break;
      case "HALF_LEFT":
        this.angularVelocity = -this.maxAngularVelocity * 0.5;
        break;
      case "FULL_LEFT":
        this.angularVelocity = -this.maxAngularVelocity;
        break;
      case "HALF_RIGHT":
        this.angularVelocity = this.maxAngularVelocity * 0.5;
        break;
      case "FULL_RIGHT":
        this.angularVelocity = this.maxAngularVelocity;
        break;
    }
  }

  private updateMovement(deltaTime: number): void {
    const dt = deltaTime / 1000; // Convert to seconds

    // Update speed (persistent until new speed order)
    this.updateSpeed(dt);

    // Update rotation from current order (temporary turn orders)
    this.updateRotation(dt);

    // Calculate forward velocity based on rotation and current speed
    this.velocity.x = Math.sin(this.rotation) * this.currentSpeed;
    this.velocity.y = -Math.cos(this.rotation) * this.currentSpeed; // Negative Y is up

    // Update position
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }

  private updateSpeed(dt: number): void {
    // Gradually accelerate/decelerate toward target speed
    if (Math.abs(this.targetSpeed - this.currentSpeed) > 1) {
      const speedDiff = this.targetSpeed - this.currentSpeed;
      const acceleration = Math.sign(speedDiff) * this.speedAcceleration * dt;
      this.currentSpeed += acceleration;

      // Clamp to target speed if we've overshot
      if (Math.sign(speedDiff) !== Math.sign(this.targetSpeed - this.currentSpeed)) {
        this.currentSpeed = this.targetSpeed;
      }
    } else {
      this.currentSpeed = this.targetSpeed;
    }
  }

  private updateRotation(dt: number): void {
    // Apply current angular velocity
    this.rotation += this.angularVelocity * dt;

    // Keep rotation in 0 to 2π range
    this.rotation = ((this.rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // Apply damping when no turn order is active
    if (!this.currentOrder || !this.isTurnOrder(this.currentOrder.type)) {
      this.angularVelocity *= this.angularDamping;
      if (Math.abs(this.angularVelocity) < 0.01) {
        this.angularVelocity = 0;
      }
    }
  }

  private isTurnOrder(orderType: OrderType): boolean {
    return orderType === "HALF_LEFT" || orderType === "FULL_LEFT" ||
           orderType === "HALF_RIGHT" || orderType === "FULL_RIGHT";
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Translate to boat position and rotate
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);

    // Draw boat hull (main body)
    ctx.fillStyle = "#FF69B4";
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Draw boat cabin (inner rectangle)
    ctx.fillStyle = "#FF1493";
    ctx.fillRect(-this.width / 2 + 5, -this.height / 2 + 5, this.width - 10, this.height - 10);

    // Draw bow (pointed front)
    ctx.fillStyle = "#FF1493";
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2);
    ctx.lineTo(-8, -this.height / 2 + 12);
    ctx.lineTo(8, -this.height / 2 + 12);
    ctx.closePath();
    ctx.fill();

    // Draw direction indicator (small line at front)
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2 + 2);
    ctx.lineTo(0, -this.height / 2 + 10);
    ctx.stroke();

    ctx.restore();
  }

  public getOrderProgress(): number {
    if (!this.currentOrder) return 0;
    const elapsed = Date.now() - this.currentOrder.startTime;
    return Math.min(elapsed / this.currentOrder.duration, 1);
  }

  public getCurrentOrderType(): OrderType | null {
    return this.currentOrder?.type || null;
  }
}
