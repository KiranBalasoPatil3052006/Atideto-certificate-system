export const CERTIFICATE = {
  width: 1344,
  height: 896,
  padding: { top: 32, right: 62, bottom: 24, left: 62 },

  colors: {
    navy: '#0b2545',
    blue: '#12539c',
    blueBright: '#1f6fd6',
    steel: '#5c7595',
    ink: '#1b232e',
    gold: '#a8791f',
    line: '#dfe4ea',
    paper: '#f7f8fa',
  },

  logo: {
    atideto: { height: 60 },
    msme: { height: 65 },
  },

  eyebrow: {
    font: 'Helvetica',
    size: 12,
    color: '#5c7595',
    letterSpacing: 2.5,
    weight: 'normal',
    uppercase: true,
  },

  title: {
    font: 'Times-Bold',
    size: 34,
    color: '#0b2545',
  },

  studentName: {
    font: 'Times-Italic',
    size: 44,
    color: '#12539c',
    letterSpacing: 1,
  },

  domain: {
    font: 'Helvetica',
    size: 13.5,
    color: '#0b2545',
    weight: 'bold',
  },
  domainValue: {
    font: 'Helvetica-Bold',
    size: 13.5,
    color: '#12539c',
  },

  description: {
    font: 'Helvetica',
    size: 14,
    color: '#333d4a',
    lineHeight: 1.68,
  },

  meta: {
    font: 'Helvetica',
    size: 10.5,
    color: '#5c7595',
  },
  metaValue: {
    font: 'Courier-Bold',
    size: 10.5,
    color: '#000000',
  },

  signature: {
    font: 'Helvetica',
    size: 11,
    color: '#0b2545',
    weight: 'bold',
  },

  footer: {
    font: 'Helvetica',
    size: 10.5,
    color: '#5c7595',
  },
};

export const COURSE_CODE_MAP = {
  'Java Full Stack Web Development': 'JFS',
  'MERN Full Stack Web Development': 'MER',
  'MEAN Full Stack Web Development': 'MEA',
  'Web Development Internship': 'WDV',
  'Python Internship': 'PYT',
  'Core Java': 'CJV',
  'Data Science Internship': 'DSC',
  'Digital Marketing Internship': 'DGM',
  'App Development Internship': 'APP',
  'Cyber Security Internship': 'CLD',
  'Cloud Internship': 'CLD',
  'UI / UX Design Internship': 'UIX',
};

export function getCourseCode(title) {
  return COURSE_CODE_MAP[title] || 'GEN';
}
