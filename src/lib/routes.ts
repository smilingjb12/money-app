export const COLLECTION_SEGMENT = "collection";

export const Routes = {
  imageWithId(imageId: string) {
    return `/images/${imageId}`;
  },
  collection() {
    return `/${COLLECTION_SEGMENT}`;
  },
  create() {
    return "/create";
  },
  upgrade() {
    return "/upgrade";
  },
  refundPolicy() {
    return "/legal/refund-policy";
  },
  privacyPolicy() {
    return "/legal/privacy-policy";
  },
  termsOfService() {
    return "/legal/terms-of-service";
  },
};
