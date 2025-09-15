import type { CarouselItem } from '../types/carousel';

// Import PNG files
import boldDiamondRing from '../assets/bold-diamond-ring.png';
import diamondTeamRing from '../assets/diamond-team-ring.png';
import paveDiamondThinDomeRing from '../assets/pave-diamond-thin-dome-ring.png';
import domeFigureDoubleLabRing from '../assets/dome-figure-double-lab.png';
import domeFigurineRing from '../assets/dome-figure.png';
import domeFigureEnamelRing from '../assets/dome-figure-enamel.png';
import domeFigureWhiteTopazRing from '../assets/dome-figure-white-topaz.png';
import domeFigureSlimRedRing from '../assets/dome-figure-slim-red-enamel.png';
import domeFigureSlimGreenRing from '../assets/dome-figure-slim-green-enamel.png';
import stackerRing from '../assets/stacker-ring.png';
import stackerDuoRing from '../assets/stacker-duo-ring.png';

// Ring product data
export const ringItems: CarouselItem[] = [
  {
    image: boldDiamondRing,
    title: 'Bold Diamond Ring',
    price: 'CA$899',
    variantLabel: '14k Yellow Gold',
    experimental: false,
  },
  {
    image: diamondTeamRing,
    title: 'Diamond Ring',
    price: 'CA$1,299',
    variantLabel: '14k White Gold',
    experimental: false,
  },
  {
    image: paveDiamondThinDomeRing,
    title: 'Pavé Dome Ring',
    price: 'CA$2,599',
    variantLabel: 'Sterling Silver',
    experimental: false,
  },
  {
    image: stackerRing,
    title: 'Stacker Ring',
    price: 'CA$599',
    variantLabel: '14k Gold Vermeil',
    experimental: false,
  },
  {
    image: stackerDuoRing,
    title: 'Stacker Duo Ring',
    price: 'CA$899',
    variantLabel: '14k Gold Vermeil',
    experimental: false,
  },
  {
    image: domeFigureDoubleLabRing,
    title: 'Dome Figure Lab Ring',
    price: 'CA$4,899',
    variantLabel: '14k Yellow Gold',
    experimental: true,
  },
  {
    image: domeFigurineRing,
    title: 'Dome Figure Ring',
    price: 'CA$1,299',
    variantLabel: '14k White Gold',
    experimental: true,
  },
  {
    image: domeFigureEnamelRing,
    title: 'Dome Figure Enamel Ring',
    price: 'CA$2,299',
    variantLabel: 'Sterling Silver',
    experimental: true,
  },
  {
    image: domeFigureWhiteTopazRing,
    title: 'Dome Figure Topaz Ring',
    price: 'CA$999',
    variantLabel: 'Sterling Silver',
    experimental: true,
  },
  {
    image: domeFigureSlimRedRing,
    title: 'Dome Figure Slim Red Enamel Ring',
    price: 'CA$399',
    variantLabel: 'Sterling Silver',
    experimental: true,
  },

  {
    image: domeFigureSlimGreenRing,
    title: 'Dome Figure Slim Green Enamel Ring',
    price: 'CA$429',
    variantLabel: 'Sterling Silver',
    experimental: true,
  },
];
