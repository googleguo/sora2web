// Credit deduction utilities
export const CREDIT_COSTS = {
  "10": 15, // 10秒视频消耗15积分
  "15": 15, // 15秒视频消耗15积分
  "25": 150, // 25秒视频消耗150积分
} as const

export function getCreditCostForDuration(duration: number): number {
  return CREDIT_COSTS[duration.toString() as keyof typeof CREDIT_COSTS] || 10
}
