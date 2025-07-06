import { NextResponse } from 'next/server';

export const supportedCountries = {
  ae: 'ar',
  af: 'ps',
  al: 'sq',
  am: 'hy',
  ao: 'pt',
  ar: 'es',
  at: 'de',
  au: 'en',
  az: 'az',
  ba: 'bs',
  bd: 'bn',
  be: 'nl',
  bf: 'fr',
  bg: 'bg',
  bh: 'ar',
  bj: 'fr',
  bn: 'ms',
  br: 'pt',
  bt: 'dz',
  bw: 'en',
  by: 'be',
  ca: 'en',
  cd: 'fr',
  cf: 'fr',
  cg: 'fr',
  ch: 'de',
  ci: 'fr',
  cl: 'es',
  cm: 'fr',
  cn: 'zh',
  co: 'es',
  cv: 'pt',
  cy: 'el',
  cz: 'cs',
  de: 'de',
  dj: 'fr',
  dk: 'da',
  dz: 'ar',
  ee: 'et',
  eg: 'ar',
  er: 'ti',
  es: 'es',
  et: 'am',
  fi: 'fi',
  fj: 'en',
  fr: 'fr',
  ga: 'fr',
  ge: 'ka',
  gh: 'en',
  gm: 'en',
  gn: 'fr',
  gq: 'es',
  gr: 'el',
  gw: 'pt',
  hr: 'hr',
  hu: 'hu',
  id: 'id',
  ie: 'en',
  il: 'he',
  in: 'hi',
  iq: 'ar',
  ir: 'fa',
  is: 'is',
  it: 'it',
  jo: 'ar',
  jp: 'ja',
  ke: 'en',
  kh: 'km',
  ki: 'en',
  kr: 'ko',
  kw: 'ar',
  kz: 'kk',
  la: 'lo',
  lk: 'ta',
  lr: 'en',
  ls: 'en',
  lt: 'lt',
  lu: 'fr',
  lv: 'lv',
  ma: 'ar',
  md: 'ro',
  me: 'sr',
  mg: 'fr',
  mk: 'mk',
  ml: 'fr',
  mm: 'my',
  mn: 'mn',
  mt: 'mt',
  mu: 'en',
  mv: 'dv',
  mw: 'en',
  mx: 'es',
  my: 'ms',
  mz: 'pt',
  na: 'en',
  ne: 'fr',
  ng: 'en',
  nl: 'nl',
  no: 'no',
  np: 'ne',
  nr: 'na',
  nz: 'en',
  om: 'ar',
  pe: 'es',
  pg: 'en',
  ph: 'tl',
  pk: 'ur',
  pl: 'pl',
  pt: 'pt',
  qa: 'ar',
  ro: 'ro',
  rs: 'sr',
  ru: 'ru',
  rw: 'rw',
  sa: 'ar',
  sb: 'en',
  sc: 'en',
  sd: 'ar',
  se: 'sv',
  sg: 'en',
  si: 'sl',
  sk: 'sk',
  sl: 'en',
  sn: 'fr',
  so: 'so',
  ss: 'en',
  st: 'pt',
  sy: 'ar',
  sz: 'en',
  td: 'fr',
  th: 'th',
  tj: 'tg',
  tm: 'tk',
  tn: 'ar',
  to: 'to',
  tr: 'tr',
  tv: 'tv',
  tz: 'sw',
  ua: 'uk',
  ug: 'en',
  uk: 'en',
  us: 'en',
  uz: 'uz',
  vn: 'vi',
  vu: 'bi',
  ws: 'sm',
  ye: 'ar',
  za: 'en',
  zm: 'en',
  zw: 'en',
};


export function middleware(request) {
    const host = request.headers.get('host') || '';
    const subdomain = host.split('.')[0].toLowerCase();
    const country = request.headers.get('x-country-code')?.toLowerCase();
    console.log("Subdomain", new Date().toUTCString(), subdomain);

    // Already on country subdomain, skip
    if (Object.keys(supportedCountries).includes(subdomain)) {
        return NextResponse.next();
    }


    console.log("Country Code", new Date().toDateString(), country);

    // If no country detected, skip
    if (!country || !supportedCountries[country]) {
        return NextResponse.next();
    }

    const language = supportedCountries[country];

    const response = NextResponse.redirect(`https://${country}.informreaders.com${request.nextUrl.pathname}`);
    response.cookies.set('i18next', language, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
}

export const config = {
    matcher: ['/((?!_next|favicon.ico|api).*)'],
};
