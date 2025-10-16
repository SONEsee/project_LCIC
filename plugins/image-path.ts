
import { useImagePath } from '@/composables/useImagePath';

export default defineNuxtPlugin((nuxtApp) => {
  const { getImageUrl, getThumbnailUrl, setImagePath } = useImagePath();
  
  
  nuxtApp.provide('imageUrl', getImageUrl);
  nuxtApp.provide('thumbnailUrl', getThumbnailUrl);
  nuxtApp.provide('setImagePath', setImagePath);
});