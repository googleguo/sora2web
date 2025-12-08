// Credit deduction utilities
export const CREDIT_COSTS = {
  "10": 10, // 10秒视频消耗10积分
  "15": 10, // 15秒视频消耗10积分
  "25": 50, // 25秒视频消耗50积分
} as const

export function getCreditCostForDuration(duration: number): number {
  return CREDIT_COSTS[duration.toString() as keyof typeof CREDIT_COSTS] || 10
}
