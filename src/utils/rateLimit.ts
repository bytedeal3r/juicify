export class TokenBucket {
  private tokens: number
  private lastRefill: number

  constructor(
    private capacity: number,
    private refillRate: number, // tokens per second
    private refillInterval: number = 1000 // ms
  ) {
    this.tokens = capacity
    this.lastRefill = Date.now()
  }

  private refill() {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    const tokensToAdd = (elapsed / this.refillInterval) * this.refillRate
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd)
    this.lastRefill = now
  }

  async consume(tokens = 1): Promise<void> {
    this.refill()
    if (this.tokens >= tokens) {
      this.tokens -= tokens
      return
    }
    const waitMs = ((tokens - this.tokens) / this.refillRate) * this.refillInterval
    await new Promise((r) => setTimeout(r, waitMs))
    this.tokens -= tokens
  }
}

export const streamBucket = new TokenBucket(30, 0.5, 1000)
export const searchBucket = new TokenBucket(100, 1.67, 1000)
