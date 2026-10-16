// Centralized image asset manager
// Using standard ESM imports ensures Vite and Rollup process and bundle
// all images with correct hashes and public base paths during GitHub Pages deployment.

import stayBedroom from '../assets/images/stay_bedroom_1781373873321.jpg';
import stayBedroomDetails from '../assets/images/stay_bedroom_details_1783202146627.jpg';
import stayExterior from '../assets/images/stay_exterior_1781373858554.jpg';
import stayGalleryCourtyardNight from '../assets/images/stay_gallery_courtyard_night_1783203752422.jpg';
import stayGalleryExteriorPath from '../assets/images/stay_gallery_exterior_path_1783203707607.jpg';
import stayGalleryKitchenDining from '../assets/images/stay_gallery_kitchen_dining_1783203719054.jpg';
import stayGalleryLivingRoom from '../assets/images/stay_gallery_living_room_1783203741878.jpg';
import stayGalleryStudyDesk from '../assets/images/stay_gallery_study_desk_1783203729757.jpg';
import staySalonDetails from '../assets/images/stay_salon_details_1783202178698.jpg';
import staySalonRoom from '../assets/images/stay_salon_room_1781374831930.jpg';
import staySpaDetails from '../assets/images/stay_spa_details_1783202168044.jpg';
import staySpaRoom from '../assets/images/stay_spa_room_1781374813579.jpg';
import stayTeaDetails from '../assets/images/stay_tea_details_1783202157565.jpg';
import stayTeaRoom from '../assets/images/stay_tea_room_1781373886604.jpg';

export const IMAGES = {
  stayBedroom,
  stayBedroomDetails,
  stayExterior,
  stayGalleryCourtyardNight,
  stayGalleryExteriorPath,
  stayGalleryKitchenDining,
  stayGalleryLivingRoom,
  stayGalleryStudyDesk,
  staySalonDetails,
  staySalonRoom,
  staySpaDetails,
  staySpaRoom,
  stayTeaDetails,
  stayTeaRoom,
} as const;
