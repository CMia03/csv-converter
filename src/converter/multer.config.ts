// import { diskStorage } from 'multer';
// import { extname } from 'path';

// export const multerConfig = {
//   storage: diskStorage({
//     destination: './uploads',
//     filename: (req, file, callback) => {
//       const randomName = Array(32)
//         .fill(null)
//         .map(() => Math.round(Math.random() * 16).toString(16))
//         .join('');
//       return callback(null, `${randomName}${extname(file.originalname)}`);
//     },
//   }),
//   fileFilter: (req, file, callback) => {
//     const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
//     const fileExt = extname(file.originalname).toLowerCase();
//     if (allowedFileTypes.includes(fileExt)) {
//       return callback(null, true);
//     } else {
//       return callback(
//         new Error(`Ce type de fichier ${fileExt} n'est pas compatible!`),
//         false
//       );
//     }
//   },
// };
