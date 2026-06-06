export const PATHS = {
  COOKIE_PERK: { id: 'cookie-perk', route: '/path/cookie-perk', label: 'I want the free cookie perk' },
  TOO_HOT: { id: 'too-hot', route: '/path/too-hot', label: "I'm hot and want cooler air" },
  COOLING_OFFER: { id: 'cooling-offer', route: '/path/cooling-offer', label: "I want today's Del Mar cooling offer" },
  AT_BOOTH: { id: 'at-booth', route: '/path/at-booth', label: "I'm at the booth now" },
  ALREADY_BOUGHT: { id: 'already-bought', route: '/path/already-bought', label: 'I already bought' },
  REFERRAL: { id: 'referral', route: '/path/referral', label: 'I want to send this to a friend' },
  FUTURE_PERKS: { id: 'future-perks', route: '/path/future-perks', label: 'I want future fair perks' },
  ESPANOL: { id: 'espanol', route: '/path/espanol', label: 'Español' },
} as const;

export const PATH_LIST = Object.values(PATHS);
