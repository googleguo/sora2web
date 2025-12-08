import crypto from "crypto"

export function verifyCreemSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac("sha256", secret)
    hmac.update(payload)
    const expectedSignature = hmac.digest("hex")

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  } catch (error) {
    console.error("[v0] Signature verification error:", error)
    return false
  }
}
