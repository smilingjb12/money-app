export const settings = {
  getDefaultFreeCredits(): number {
    return Number(process.env.DEFAULT_CREDITS!);
  },

  getUploadSizeLimit(): number {
    return Number(process.env.NEXT_PUBLIC_UPLOAD_SIZE_LIMIT!);
  },
};
