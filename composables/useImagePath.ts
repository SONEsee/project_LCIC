
import { ref, computed } from 'vue';

const imagePath = ref<string>('');

export const useImagePath = () => {
  const config = useRuntimeConfig();
  
 
  if (!imagePath.value) {
    imagePath.value = config.public.apiBase || config.public.strapi.url || '';
  }


  const getFileUrl = (path: string): string => {
    if (!path) return '';
    
    
    let cleanPath = path.trim();
    
  
    if (cleanPath.startsWith('/media/')) {
      cleanPath = cleanPath.slice(7);
    } else if (cleanPath.startsWith('media/')) {
      cleanPath = cleanPath.slice(6);
    } else if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.slice(1);
    }
    
    
    let baseUrl = imagePath.value;
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    
    return `${baseUrl}/media/${cleanPath}`;
  };

  const getFileType = (path: string): 'image' | 'pdf' | 'document' | 'unknown' => {
    if (!path) return 'unknown';
    
    const extension = path.split('.').pop()?.toLowerCase();
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const pdfExtensions = ['pdf'];
    const documentExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    
    if (imageExtensions.includes(extension || '')) return 'image';
    if (pdfExtensions.includes(extension || '')) return 'pdf';
    if (documentExtensions.includes(extension || '')) return 'document';
    
    return 'unknown';
  };

  const getFileIcon = (path: string): string => {
    const type = getFileType(path);
    const icons = {
      image: 'mdi-image',
      pdf: 'mdi-file-pdf-box',
      document: 'mdi-file-document',
      unknown: 'mdi-file'
    };
    return icons[type];
  };

  const getFileColor = (path: string): string => {
    const type = getFileType(path);
    const colors = {
      image: 'blue',
      pdf: 'red',
      document: 'orange',
      unknown: 'grey'
    };
    return colors[type];
  };

  const isImage = (path: string): boolean => getFileType(path) === 'image';
  const isPdf = (path: string): boolean => getFileType(path) === 'pdf';

  const setImagePath = (newPath: string) => {
    imagePath.value = newPath;
  };

  return {
    imagePath: computed(() => imagePath.value),
    getFileUrl,
    getFileType,
    getFileIcon,
    getFileColor,
    isImage,
    isPdf,
    setImagePath,
 
    getImageUrl: getFileUrl,
    getThumbnailUrl: getFileUrl
  };
};