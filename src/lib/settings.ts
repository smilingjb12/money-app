export const settings = {
  getDefaultFreeCredits(): number {
    return Number(process.env.DEFAULT_CREDITS!);
  },

  getUploadSizeLimit(): number {
    return Number(process.env.NEXT_PUBLIC_UPLOAD_SIZE_LIMIT!);
  },

  getStripeTier1PriceId(): string {
    return process.env.NEXT_PUBLIC_STRIPE_TIER_1_PRICEID!;
  },

  getStripeTier2PriceId(): string {
    return process.env.NEXT_PUBLIC_STRIPE_TIER_2_PRICEID!;
  },

  getStripeTier3PriceId(): string {
    return process.env.NEXT_PUBLIC_STRIPE_TIER_3_PRICEID!;
  },

  getStripeTier1Credits(): number {
    return Number(process.env.NEXT_PUBLIC_STRIPE_TIER_1_CREDITS!);
  },

  getStripeTier2Credits(): number {
    return Number(process.env.NEXT_PUBLIC_STRIPE_TIER_2_CREDITS!);
  },

  getStripeTier3Credits(): number {
    return Number(process.env.NEXT_PUBLIC_STRIPE_TIER_3_CREDITS!);
  },
};
