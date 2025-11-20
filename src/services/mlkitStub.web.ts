/**
 * ML Kit stub for web platform
 * Web doesn't support ML Kit, so we provide a stub that throws an error
 */

export default {
  recognize: async () => {
    throw new Error('ML Kit is not available on web platform');
  },
};
