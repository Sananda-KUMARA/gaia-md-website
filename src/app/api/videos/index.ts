// pages/api/videos/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/mongodb';
import VideoModel from '../../../models/Video';

// Types pour la réponse API
interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { method } = req;
  
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const videos = await VideoModel.find({ active: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: videos });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
        res.status(400).json({ success: false, message: errorMessage });
      }
      break;
      
    case 'POST':
      try {
        // Vérifier l'authentification pour les opérations de création
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          return res.status(401).json({ success: false, message: 'Non autorisé' });
        }
        
        const video = await VideoModel.create(req.body);
        res.status(201).json({ success: true, data: video });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
        res.status(400).json({ success: false, message: errorMessage });
      }
      break;
      
    default:
      res.status(400).json({ success: false, message: 'Méthode non prise en charge' });
      break;
  }
}

// pages/api/videos/[id].ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../auth/[...nextauth]';
// import dbConnect from '../../../lib/mongodb';
// import VideoModel from '../../../models/Video';

// // Types pour la réponse API
// interface ApiResponse {
//   success: boolean;
//   data?: any;
//   message?: string;
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ApiResponse>
// ) {
//   const {
//     query: { id },
//     method,
//   } = req;

//   await dbConnect();

//   if (!id || Array.isArray(id)) {
//     return res.status(400).json({ success: false, message: 'ID de vidéo invalide' });
//   }

//   switch (method) {
//     case 'GET':
//       try {
//         const video = await VideoModel.findById(id);
        
//         if (!video) {
//           return res.status(404).json({ success: false, message: 'Vidéo non trouvée' });
//         }
        
//         res.status(200).json({ success: true, data: video });
//       } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
//         res.status(400).json({ success: false, message: errorMessage });
//       }
//       break;
      
//     case 'PUT':
//       try {
//         // Vérifier l'authentification pour les opérations de modification
//         const session = await getServerSession(req, res, authOptions);
//         if (!session) {
//           return res.status(401).json({ success: false, message: 'Non autorisé' });
//         }
        
//         const video = await VideoModel.findByIdAndUpdate(id, req.body, {
//           new: true,
//           runValidators: true,
//         });
        
//         if (!video) {
//           return res.status(404).json({ success: false, message: 'Vidéo non trouvée' });
//         }
        
//         res.status(200).json({ success: true, data: video });
//       } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
//         res.status(400).json({ success: false, message: errorMessage });
//       }
//       break;
      
//     case 'DELETE':
//       try {
//         // Vérifier l'authentification pour les opérations de suppression
//         const session = await getServerSession(req, res, authOptions);
//         if (!session) {
//           return res.status(401).json({ success: false, message: 'Non autorisé' });
//         }
        
//         const deletedVideo = await VideoModel.findByIdAndDelete(id);
        
//         if (!deletedVideo) {
//           return res.status(404).json({ success: false, message: 'Vidéo non trouvée' });
//         }
        
//         res.status(200).json({ success: true, data: {} });
//       } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
//         res.status(400).json({ success: false, message: errorMessage });
//       }
//       break;
      
//     default:
//       res.status(400).json({ success: false, message: 'Méthode non prise en charge' });
//       break;
//   }
// }

// // pages/api/videos/category/[category].ts
// // import { NextApiRequest, NextApiResponse } from 'next';
// // import dbConnect from '../../../../lib/mongodb';
// // import VideoModel from '../../../../models/Video';

// // // Types pour la réponse API
// // interface ApiResponse {
// //   success: boolean;
// //   data?: any;
// //   message?: string;
// // }

// // export default async function handler(
// //   req: NextApiRequest,
// //   res: NextApiResponse<ApiResponse>
// // ) {
// //   const {
// //     query: { category },
// //     method,
// //   } = req;

// //   await dbConnect();

// //   if (!category || Array.isArray(category)) {
// //     return res.status(400).json({ success: false, message: 'Catégorie invalide' });
// //   }

// //   if (method === 'GET') {
// //     try {
// //       const videos = await VideoModel.find({ 
// //         category: category,
// //         active: true 
// //       }).sort({ createdAt: -1 });
      
// //       res.status(200).json({ success: true, data: videos });
// //     } catch (error) {
// //       const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
// //       res.status(400).json({ success: false, message: errorMessage });
// //     }
// //   } else {
// //     res.status(400).json({ success: false, message: 'Méthode non prise en charge' });
// //   }
// // }