import { IMAGES } from '../assets/imagesMap';

export interface Room {
  id: 'on' | 'eul' | 'ahn' | 'gyeol';
  title: string;
  subTitle: string;
  capacity: string;
  image: string;
  images: string[];
  theme: string;
  description: string;
  guestHighlights: string[];
  features: string[];
  amenities: string[];
}

export const ROOMS_DATA: Room[] = [
  {
    id: 'on',
    title: '온 (溫)',
    subTitle: '온전한 쉼의 침실',
    capacity: '기준 2인 / 최대 5인',
    image: IMAGES.stayBedroom,
    images: [
      IMAGES.stayBedroom,
      IMAGES.stayBedroomDetails,
      IMAGES.stayGalleryLivingRoom,
      IMAGES.stayExterior
    ],
    theme: 'Bedroom & Cinema',
    description: '오가닉 워싱 린넨 침구와 천장 시네빔으로 누워서 영화를 감상하는 고요한 침실입니다.',
    guestHighlights: [
      '침대에 누워 천장 화면으로 편안하게 즐기는 고화질 시네빔 OTT',
      '프리미엄 킹사이즈 오가닉 린넨 베딩이 선사하는 깊은 숙면',
      '통창 너머 아침 햇살과 함께 마주하는 고즈넉한 정원 풍경'
    ],
    features: ['오가닉 린넨 킹베드', '천장 고화질 시네빔', '마샬 블루투스 스피커'],
    amenities: ['킹사이즈 베드', '천장 시네빔', '마샬 스피커', '르 라보 바디 어메니티']
  },
  {
    id: 'eul',
    title: '을 (乙)',
    subTitle: '바람이 머무는 다실',
    capacity: '기준 2인 / 최대 5인',
    image: IMAGES.stayTeaRoom,
    images: [
      IMAGES.stayTeaRoom,
      IMAGES.stayTeaDetails,
      IMAGES.stayGalleryKitchenDining,
      IMAGES.stayGalleryExteriorPath
    ],
    theme: 'Tea Ceremony & Garden',
    description: '대나무 정원을 마주하며 명인의 수제 다기로 계절 차를 음미하는 프라이빗 다실입니다.',
    guestHighlights: [
      '푸른 대나무 숲과 솔바람 소리가 전해지는 파노라마 정원 뷰',
      '장인의 수제 도자기 다기로 정성껏 우려내는 프리미엄 웰컴 티',
      '맑은 싱잉볼 소리와 함께 복잡한 생각을 비워내는 사색의 시간'
    ],
    features: ['명인 수제 다기 세트', '대나무 정원 파노라마 뷰', '웰컴 프리미엄 티'],
    amenities: ['우롱·호지차 찻잎', '명인 다기 세트', '명상 싱잉볼', '전기 티포트']
  },
  {
    id: 'ahn',
    title: '안 (安)',
    subTitle: '고요를 품은 온욕실',
    capacity: '기준 2인 / 최대 5인',
    image: IMAGES.staySpaRoom,
    images: [
      IMAGES.staySpaRoom,
      IMAGES.staySpaDetails,
      IMAGES.stayGalleryCourtyardNight,
      IMAGES.stayGalleryStudyDesk
    ],
    theme: 'Hot Spa & Hinoki Bath',
    description: '자연 화산석 대형 욕조와 편백 아로마로 피로를 녹여내는 프라이빗 스파 공간입니다.',
    guestHighlights: [
      '2인이 여유롭게 몸을 담그는 천연 화산석 대형 반신욕조',
      '천연 편백 오일과 시그니처 배스 솔트로 즐기는 아로마 힐링',
      '호텔식 순면 가운과 르 라보(Le Labo) 4종 헤어·바디 케어 완비'
    ],
    features: ['천연 화산석 대형 욕조', '편백 바스 솔트 키트', '르 라보 어메니티'],
    amenities: ['화산석 스파 욕조', '편백 배스 솔트', '오가닉 가운 키트', '르 라보 4종 세트']
  },
  {
    id: 'gyeol',
    title: '결 (結)',
    subTitle: '마음을 엮는 음악실',
    capacity: '기준 2인 / 최대 5인',
    image: IMAGES.staySalonRoom,
    images: [
      IMAGES.staySalonRoom,
      IMAGES.staySalonDetails,
      IMAGES.stayGalleryStudyDesk,
      IMAGES.stayGalleryLivingRoom
    ],
    theme: 'Vinyl Salon & Books',
    description: '아날로그 턴테이블의 따스한 선율과 엄선된 도서가 머무는 감성 청음 살롱입니다.',
    guestHighlights: [
      '재즈, 어쿠스틱, 시티팝 명반으로 구성된 큐레이션 LP 감상',
      '아날로그 감성을 전하는 오디오 테크니카 턴테이블 시스템',
      '편안한 패브릭 소파에 기대어 즐기는 프라이빗 독서 서가'
    ],
    features: ['고음질 LP 턴테이블', '장르별 바이닐 콜렉션', '사색의 독서 서가'],
    amenities: ['오디오 턴테이블', '큐레이션 LP 30선', '로우 패브릭 소파', '디자인 서적']
  }
];
