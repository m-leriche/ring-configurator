import type { CarouselItem } from '../types/carousel';

// Import PNG files
import boldDiamondRing from '../assets/bold-diamond-ring.png';
import diamondTeamRing from '../assets/diamond-team-ring.png';
import paveDiamondThinDomeRing from '../assets/pave-diamond-thin-dome-ring.png';
import domeFigureDoubleLabRing from '../assets/dome-figure-double-lab.png';
import domeFigurineRing from '../assets/dome-figure.png';
import domeFigureEnamelRing from '../assets/dome-figure-enamel.png';
import domeFigureWhiteTopazRing from '../assets/dome-figure-white-topaz.png';

// Ring product data
export const ringItems: CarouselItem[] = [
  {
    image: boldDiamondRing,
    title: 'Bold Diamond Ring',
    price: 'CA$2,899',
    variantLabel: '14k Yellow Gold',
  },
  {
    image: diamondTeamRing,
    title: 'Diamond Ring',
    price: 'CA$3,299',
    variantLabel: '14k White Gold',
  },
  {
    image: paveDiamondThinDomeRing,
    title: 'Pavé Dome Ring',
    price: 'CA$2,599',
    variantLabel: 'Sterling Silver',
  },
  {
    image: domeFigureDoubleLabRing,
    title: 'Dome Figure Lab Ring',
    price: 'CA$2,899',
    variantLabel: '14k Yellow Gold',
  },
  {
    image: domeFigurineRing,
    title: 'Dome Figure Ring',
    price: 'CA$3,299',
    variantLabel: '14k White Gold',
  },
  {
    image: domeFigureEnamelRing,
    title: 'Dome Figure Enamel Ring',
    price: 'CA$2,599',
    variantLabel: 'Sterling Silver',
  },
  {
    image: domeFigureWhiteTopazRing,
    title: 'Dome Figure Topaz Ring',
    price: 'CA$2,599',
    variantLabel: 'Sterling Silver',
  },
];
