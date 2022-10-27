import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Luke',
      email: 'admin@watchstop.com',
      password: bcrypt.hashSync('pwd123'),
      admin: true,
    },
    {
      name: 'Max',
      email: 'max@gmail.com',
      password: bcrypt.hashSync('pwd123'),
      admin: false,
    },
  ],
  products: [
    {
      name: 'Pegasus',
      slug: 'pegasus',
      category: 'Classic',
      image:
        'https://res.cloudinary.com/lukeprosser/image/upload/v1666801658/watchstop/pegasus.jpg',
      price: 79.99,
      brand: 'Galactic',
      rating: 4.5,
      numReviews: 9,
      stockCount: 17,
      description:
        'A classic timekeeper for casually elegant or formal occasions. The leather strap and loop of this striking model leads the fashion-conscious eye from the buckle to the case. The sun brushed black dial presents slim tone-on-tone black hour indexes. Black hour and minute hands with tone-on-tone black highlights and a slim black seconds hand mark the time of day.',
    },
    {
      name: 'Grus',
      slug: 'grus',
      category: 'Casual',
      image:
        'https://res.cloudinary.com/lukeprosser/image/upload/v1666801657/watchstop/grus.jpg',
      price: 59.99,
      brand: 'Lunar',
      rating: 4,
      numReviews: 7,
      stockCount: 22,
      description:
        "The perfect watch for a day out. This model features a sun-brushed black dial with yellow print and a day-date window at 3 o'clock, wrapped in a transparent matte clear plastic case. The simple yet sturdy look is held together by a supple brown leather bracelet with white stitching, a brown leather loop and fastened with a transparent matte clear plastic buckle.",
    },
    {
      name: 'Scorpius',
      slug: 'scorpius',
      category: 'Minimal',
      image:
        'https://res.cloudinary.com/lukeprosser/image/upload/v1666801658/watchstop/scorpius.jpg',
      price: 69.99,
      brand: 'Solar',
      rating: 5,
      numReviews: 12,
      stockCount: 19,
      description:
        'Go uptown with the Scorpius. A polished stainless steel case houses the automatic watch design, while the openwork caseback reveals the inner workings of the self-winding mechanical movement. Strap on the suave premium leather and watch the alligator skin pattern and bottomless blue, sun-brushed dial turn heads wherever the night takes you.',
    },
    {
      name: 'Vega',
      slug: 'vega',
      category: 'Modern',
      image:
        'https://res.cloudinary.com/lukeprosser/image/upload/v1666801658/watchstop/vega.jpg',
      price: 72.99,
      brand: 'Andromeda',
      rating: 4,
      numReviews: 8,
      stockCount: 32,
      description:
        'Rev up your style with Vega, which combines both sportiness and elegance in one debonair model. Featuring a sun-brushed black and copper dial with white print, it has the added benefits of a date window at 4:30 and hands with superluminova. A polished stainless steel with black PVD bezel is engraved and filled in white, and housed in a case of polished stainless steel. Giving the impression of a long black racing stripe, the bracelet is made of adjustable polished stainless steel with black resin middle links.',
    },
    {
      name: 'Leo',
      slug: 'leo',
      category: 'Minimal',
      image:
        'https://res.cloudinary.com/lukeprosser/image/upload/v1666801657/watchstop/leo.jpg',
      price: 89.99,
      brand: 'Flare',
      rating: 4.5,
      numReviews: 6,
      stockCount: 15,
      description:
        "Light up your nights with Leo, which features an all-black colour scheme. This model sets a sombre mood with asun-brushed black with black print dial, a date window at 4:30 and hands with superluminova. It's encircled with a polished stainless steel with black PVD engraved bezel and wrapped with a polished stainless steel with black PVD case. Tying together the dark look is an adjustable polished stainless steel with black PVD bracelet.",
    },
    {
      name: 'Corvus',
      slug: 'corvus',
      category: 'Classic',
      image:
        'https://res.cloudinary.com/lukeprosser/image/upload/v1666801657/watchstop/corvus.jpg',
      price: 99.99,
      brand: 'Eclipse',
      rating: 3.5,
      numReviews: 11,
      stockCount: 23,
      description:
        'Ready, aim, fire! Corvus stands out from the pack with its luxury leather strap and black and copper face. Hardwearing and strong, this watch will stay with you whatever comes your way.',
    },
    {
      name: 'Orion',
      slug: 'orion',
      category: 'Classic',
      image:
        'https://res.cloudinary.com/lukeprosser/image/upload/v1666801657/watchstop/orion.jpg',
      price: 79.99,
      brand: 'Orbit',
      rating: 4,
      numReviews: 21,
      stockCount: 29,
      description:
        "A timeless design for the man on the go, the Orion watch features a sun-brushed blue dial with red numerals, silver and white prints, three counters and a date window at 6 o'clock. This sophisticated style is set apart with a polished stainless steel case and a black bezel. A polished stainless steel strap with a traditional link pattern completes the design.",
    },
    {
      name: 'Lyra',
      slug: 'lyra',
      category: 'Modern',
      image:
        'https://res.cloudinary.com/lukeprosser/image/upload/v1666801657/watchstop/lyra.jpg',
      price: 49.99,
      brand: 'Solar',
      rating: 3.5,
      numReviews: 26,
      stockCount: 34,
      description:
        "Lyra has a trendy black rubber strap with a ribbed structure. The sun-brushed midnight blue dial has silvery hands coated with a glow-in-the-dark treatment, so you'll always know what time it is!",
    },
  ],
};

export default data;
