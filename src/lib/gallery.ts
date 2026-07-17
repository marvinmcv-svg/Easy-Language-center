// Manifest of the real marketing assets in /public/uploads/gallery
// Captions derived from VLM analysis of each uploaded poster.

export interface GalleryItem {
  file: string;
  url: string;
  title: string;
  language?: string;
  tag?: string;
}

export const GALLERY: GalleryItem[] = [
  {
    file: "475998988_18038458649595542_3707722015256172690_n.webp",
    url: "/uploads/gallery/475998988_18038458649595542_3707722015256172690_n.webp",
    title: "Cursos de Idiomas — Presenciales y Virtuales",
    tag: "6 idiomas",
  },
  {
    file: "481091849_18040812974595542_4150313629655013428_n.webp",
    url: "/uploads/gallery/481091849_18040812974595542_4150313629655013428_n.webp",
    title: "Clases de Inglés para Niños",
    language: "english",
    tag: "Niños 7-12",
  },
  {
    file: "486510128_18044430308595542_7475337644356252784_n.webp",
    url: "/uploads/gallery/486510128_18044430308595542_7475337644356252784_n.webp",
    title: "Clases de Italiano — Nivel Inicial",
    language: "italian",
    tag: "Italiano",
  },
  {
    file: "619529979_18003105896699708_2731365133938606640_n.jpg",
    url: "/uploads/gallery/619529979_18003105896699708_2731365133938606640_n.jpg",
    title: "Asesoramiento Psicológico",
    tag: "Servicio integral",
  },
  {
    file: "620858528_17961498471041770_768475444943909115_n.webp",
    url: "/uploads/gallery/620858528_17961498471041770_768475444943909115_n.webp",
    title: "Aprende el idioma de tus sueños",
    tag: "Exámenes internacionales",
  },
  {
    file: "623262065_18088780517009846_6873269014179312801_n.jpg",
    url: "/uploads/gallery/623262065_18088780517009846_6873269014179312801_n.jpg",
    title: "Clases de Italiano",
    language: "italian",
    tag: "Italiano",
  },
  {
    file: "623720846_18088244630103736_4623931739164750290_n.jpg",
    url: "/uploads/gallery/623720846_18088244630103736_4623931739164750290_n.jpg",
    title: "Clases de Italiano — Todos los niveles",
    language: "italian",
    tag: "Privadas o grupales",
  },
  {
    file: "624163625_18120260716574874_7020612073827153919_n.jpg",
    url: "/uploads/gallery/624163625_18120260716574874_7020612073827153919_n.jpg",
    title: "English Class — Nivel 1 & 2",
    language: "english",
    tag: "Inglés",
  },
  {
    file: "650271884_18055814087699644_6045414711612326015_n.jpg",
    url: "/uploads/gallery/650271884_18055814087699644_6045414711612326015_n.jpg",
    title: "English Class — Nivel 1 & 2",
    language: "english",
    tag: "Inglés",
  },
  {
    file: "652555662_18130099585538433_305872883940597844_n.jpg",
    url: "/uploads/gallery/652555662_18130099585538433_305872883940597844_n.jpg",
    title: "Clases de Alemán",
    language: "german",
    tag: "Alemán",
  },
  {
    file: "656161646_18124994833569610_8557727610257338030_n.jpg",
    url: "/uploads/gallery/656161646_18124994833569610_8557727610257338030_n.jpg",
    title: "Aprende Portugués — Brasil y Portugal",
    language: "portuguese",
    tag: "Portugués",
  },
  {
    file: "656179905_18115497511639503_1311619569847497714_n.jpg",
    url: "/uploads/gallery/656179905_18115497511639503_1311619569847497714_n.jpg",
    title: "Clases Privadas de Inglés",
    language: "english",
    tag: "1 a 1",
  },
  {
    file: "674551612_18089695259595542_4770888529145273074_n.webp",
    url: "/uploads/gallery/674551612_18089695259595542_4770888529145273074_n.webp",
    title: "Prepárate para el TOEFL",
    language: "english",
    tag: "TOEFL",
  },
  {
    file: "697110202_18092415734595542_1922747966236048736_n.webp",
    url: "/uploads/gallery/697110202_18092415734595542_1922747966236048736_n.webp",
    title: "Clases de Inglés — Nivel 1",
    language: "english",
    tag: "20% off",
  },
  {
    file: "698359980_18092038184595542_8648126222764735708_n.webp",
    url: "/uploads/gallery/698359980_18092038184595542_8648126222764735708_n.webp",
    title: "Clases de Inglés para Adultos y Niños",
    language: "english",
    tag: "Sábados",
  },
  {
    file: "721135876_18095914547595542_4185971871774599713_n.webp",
    url: "/uploads/gallery/721135876_18095914547595542_4185971871774599713_n.webp",
    title: "Clases Privadas de Inglés — Atención 1 a 1",
    language: "english",
    tag: "Personalizado",
  },
  {
    file: "722753579_18096692558595542_4752076824264348154_n.webp",
    url: "/uploads/gallery/722753579_18096692558595542_4752076824264348154_n.webp",
    title: "Curso Intensivo de Inglés",
    language: "english",
    tag: "Intensivo",
  },
];

// Course poster images available to attach to seeded courses.
export const COURSE_IMAGES = {
  englishKids: "/uploads/gallery/481091849_18040812974595542_4150313629655013428_n.webp",
  englishIntensive: "/uploads/gallery/722753579_18096692558595542_4752076824264348154_n.webp",
  englishPrivate: "/uploads/gallery/721135876_18095914547595542_4185971871774599713_n.webp",
  englishAdults: "/uploads/gallery/698359980_18092038184595542_8648126222764735708_n.webp",
  toefl: "/uploads/gallery/674551612_18089695259595542_4770888529145273074_n.webp",
  italian: "/uploads/gallery/486510128_18044430308595542_7475337644356252784_n.webp",
  italian2: "/uploads/gallery/623720846_18088244630103736_4623931739164750290_n.jpg",
  german: "/uploads/gallery/652555662_18130099585538433_305872883940597844_n.jpg",
  portuguese: "/uploads/gallery/656161646_18124994833569610_8557727610257338030_n.jpg",
  all: "/uploads/gallery/475998988_18038458649595542_3707722015256172690_n.webp",
} as const;
