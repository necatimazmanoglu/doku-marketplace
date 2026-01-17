import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers, // <--- Bunu ekledik
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Standart bileşenler (Dropzone vs.)
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// ÖZEL TASARIM İÇİN GEREKLİ OLAN KISIM BURASI:
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();