// In-memory rate limiter (sliding window)
// For production at scale, replace with Redis-based rate limiting.

interface RateLimitEntry {
  timestamps: number[]
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 3600000)
    if (entry.timestamps.length === 0) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

interface RateLimitOptions {
  /** Maximum number of requests allowed within the window */
  maxRequests?: number
  /** Window size in milliseconds */
  windowMs?: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

/**
 * Check rate limit for a given identifier (typically IP address).
 * Returns { success, remaining, resetAt }
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { maxRequests = 10, windowMs = 3600000 } = options // Default: 10 per hour

  const now = Date.now()
  const entry = rateLimitStore.get(identifier) || { timestamps: [] }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs)

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0]
    return {
      success: false,
      remaining: 0,
      resetAt: oldestInWindow + windowMs,
    }
  }

  entry.timestamps.push(now)
  rateLimitStore.set(identifier, entry)

  return {
    success: true,
    remaining: maxRequests - entry.timestamps.length,
    resetAt: now + windowMs,
  }
}
