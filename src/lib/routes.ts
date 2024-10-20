export const Routes = {
  imagePage(imageId: string) {
    return `/images/${imageId}`;
  },
  collectionPage() {
    return "/collection";
  },
  createPage() {
    return "/create";
  },
  upgradePage() {
    return "/upgrade";
  },
  refundPolicyPage() {
    return "/legal/refund-policy";
  },
};
