<template>
  <div>
    <input type="file" @change="handleFileUpload" />
    <p>{{ textContent }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Tesseract from 'tesseract.js';

export default defineComponent({
  setup() {
    const textContent = ref<string | null>(null);

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;

      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const image = new Image();
          image.src = reader.result as string;

          image.onload = () => {
            
            const canvas = enhanceImage(image);
            
            Tesseract.recognize(
              canvas,
              'eng+lao+tha', 
              {
                langPath: 'path/to/langdata', 
                logger: m => console.log(m),
                tessedit_char_whitelist: 'ຂໍ້ຄວາມຂອງພາສາທີ່ທ່ານຕ້ອງການ'
              }
            ).then(({ data: { text } }) => {
              textContent.value = text;
            }).catch(error => {
              console.error('Error recognizing text:', error);
            });
          };
        };

        reader.onerror = () => {
          console.error('Error reading file');
        };
      }
    };

    
    const enhanceImage = (image: HTMLImageElement): HTMLCanvasElement => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = image.width;
        canvas.height = image.height;

        
        ctx.drawImage(image, 0, 0);

        
        ctx.filter = 'brightness(1.2) contrast(1.1)';

        
        ctx.drawImage(canvas, 0, 0);
      }

      return canvas;
    };

    return {
      handleFileUpload,
      textContent
    };
  }
});
</script>
