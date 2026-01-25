import type { ImageMetadata } from 'astro';

import berlinImg from '@/assets/images/section-city-context-berlin.png';
import muenchenImg from '@/assets/images/section-city-context-muenchen.png';
import hamburgImg from '@/assets/images/section-city-context-hamburg.png';
import koelnImg from '@/assets/images/section-city-context-koeln.png';
import frankfurtImg from '@/assets/images/section-city-context-frankfurt.png';
import duesseldorfImg from '@/assets/images/section-city-context-duesseldorf.png';
import essenImg from '@/assets/images/section-city-context-essen.png';

export interface CityData {
  slug: string;
  name: string;
  displayName: string;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    h1: string;
    text: string;
  };
  cityContext: {
    h2: string;
    text: string;
    image: ImageMetadata;
  };
}

export const cities: CityData[] = [
  {
    slug: 'berlin',
    name: 'Berlin',
    displayName: 'Berlin',
    meta: {
      title: 'Messie-Hilfe in Berlin – Messie-Wohnung entrümpeln & reinigen',
      description:
        'Diskrete Messie-Hilfe in Berlin ohne Bewertung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig. Jetzt anfragen.',
    },
    hero: {
      h1: 'Messie-Hilfe & Messie-Wohnung entrümpeln in Berlin – diskret & anonym',
      text: 'Eine Messie-Wohnung zu entrümpeln ist für viele Betroffene und Angehörige eine schwere Aufgabe. Oft fehlt der Überblick, wo man anfangen soll – oder die Situation ist emotional zu belastend.\n\nWir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Berlin – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe in Berlin – ruhig, diskret, strukturiert',
      text: 'Berlin ist eine Stadt mit sehr unterschiedlichen Wohn- und Lebenssituationen. Enge Altbauwohnungen, über Jahre genutzte Räume oder persönliche Veränderungen können dazu führen, dass Ordnung schrittweise verloren geht – oft unbemerkt.\n\nGerade hier ist ein respektvoller Umgang entscheidend. Unsere Messie-Hilfe in Berlin setzt auf Diskretion, klare Abläufe und einen ruhigen Einstieg. Wir unterstützen strukturiert und ohne Bewertung – in dem Tempo, das sich richtig anfühlt.',
      image: berlinImg,
    },
  },
  {
    slug: 'muenchen',
    name: 'München',
    displayName: 'München',
    meta: {
      title: 'Messie-Hilfe München – Messie-Wohnung entrümpeln & reinigen',
      description:
        'Diskrete Messie-Hilfe in München ohne Bewertung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig.',
    },
    hero: {
      h1: 'Messie-Hilfe & Messie-Wohnung entrümpeln München – diskret & anonym',
      text: 'Eine Messie-Wohnung zu entrümpeln ist für viele Betroffene und Angehörige eine schwere Aufgabe. Oft fehlt der Überblick, wo man anfangen soll – oder die Situation ist emotional zu belastend.\n\nWir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in München – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe München – ruhig, diskret, strukturiert',
      text: 'München ist eine Stadt mit hoher Wohnraumnachfrage und sehr unterschiedlichen Lebenssituationen. Enge Wohnungen, über Jahre genutzte Räume oder persönliche Veränderungen können dazu führen, dass Ordnung schrittweise verloren geht – oft unbemerkt.\n\nGerade hier ist ein respektvoller Umgang entscheidend. Unsere Messie-Hilfe in München setzt auf Diskretion, klare Abläufe und einen ruhigen Einstieg. Wir unterstützen strukturiert und ohne Bewertung – in dem Tempo, das sich richtig anfühlt.',
      image: muenchenImg,
    },
  },
  {
    slug: 'hamburg',
    name: 'Hamburg',
    displayName: 'Hamburg',
    meta: {
      title: 'Messie-Hilfe Hamburg – Messie-Wohnung entrümpeln & reinigen',
      description:
        'Diskrete Messie-Hilfe in Hamburg ohne Bewertung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig.',
    },
    hero: {
      h1: 'Messie-Hilfe & Messie-Wohnung entrümpeln Hamburg – diskret & anonym',
      text: 'Eine Messie-Wohnung zu entrümpeln ist für viele Betroffene und Angehörige eine schwere Aufgabe. Oft fehlt der Überblick, wo man anfangen soll – oder die Situation ist emotional zu belastend.\n\nWir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Hamburg – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe Hamburg – ruhig, diskret, strukturiert',
      text: 'Hamburg ist eine Großstadt mit sehr unterschiedlichen Wohn- und Lebenssituationen. Enge innerstädtische Wohnungen, lange genutzte Räume oder persönliche Veränderungen können dazu führen, dass Ordnung schrittweise verloren geht – oft unbemerkt.\n\nGerade hier ist ein respektvoller Umgang entscheidend. Unsere Messie-Hilfe in Hamburg setzt auf Diskretion, klare Abläufe und einen ruhigen Einstieg. Wir unterstützen strukturiert und ohne Bewertung – in dem Tempo, das sich richtig anfühlt.',
      image: hamburgImg,
    },
  },
  {
    slug: 'koeln',
    name: 'Köln',
    displayName: 'Köln',
    meta: {
      title: 'Messie-Hilfe in Köln – Messie-Wohnung entrümpeln & reinigen',
      description:
        'Diskrete Messie-Hilfe in Köln ohne Bewertung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig. Jetzt Anfragen',
    },
    hero: {
      h1: 'Messie-Hilfe & Messie-Wohnung entrümpeln in Köln – diskret & anonym',
      text: 'Eine Messie-Wohnung zu entrümpeln ist für viele Betroffene und Angehörige eine schwere Aufgabe. Oft fehlt der Überblick, wo man anfangen soll – oder die Situation ist emotional zu belastend.\n\nWir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Köln – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe in Köln – ruhig, diskret, strukturiert',
      text: 'Köln ist eine Stadt mit sehr unterschiedlichen Wohn- und Lebenssituationen. Wohnungen in gewachsenen Stadtstrukturen, langjährig genutzte Räume oder persönliche Veränderungen können dazu führen, dass Ordnung schrittweise verloren geht – oft unbemerkt.\n\nGerade hier ist ein respektvoller Umgang entscheidend. Unsere Messie-Hilfe in Köln setzt auf Diskretion, klare Abläufe und einen ruhigen Einstieg. Wir unterstützen strukturiert und ohne Bewertung – in dem Tempo, das sich richtig anfühlt.',
      image: koelnImg,
    },
  },
  {
    slug: 'frankfurt',
    name: 'Frankfurt',
    displayName: 'Frankfurt',
    meta: {
      title: 'Messie-Hilfe Frankfurt – Messie-Wohnung entrümpeln & reinigen',
      description:
        'Diskrete Messie-Hilfe in Frankfurt ohne Bewertung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig.',
    },
    hero: {
      h1: 'Messie-Hilfe & Messie-Wohnung entrümpeln Frankfurt – diskret & anonym',
      text: 'Eine Messie-Wohnung zu entrümpeln ist für viele Betroffene und Angehörige eine schwere Aufgabe. Oft fehlt der Überblick, wo man anfangen soll – oder die Situation ist emotional zu belastend.\n\nWir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Frankfurt – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe Frankfurt – ruhig, diskret, strukturiert',
      text: 'Frankfurt ist eine Stadt mit sehr unterschiedlichen Wohn- und Lebenssituationen. Kleine Wohnungen, langjährig genutzte Räume oder persönliche Veränderungen können dazu führen, dass Ordnung schrittweise verloren geht – oft unbemerkt.\n\nGerade hier ist ein respektvoller Umgang entscheidend. Unsere Messie-Hilfe in Frankfurt setzt auf Diskretion, klare Abläufe und einen ruhigen Einstieg. Wir unterstützen strukturiert und ohne Bewertung – in dem Tempo, das sich richtig anfühlt.',
      image: frankfurtImg,
    },
  },
  {
    slug: 'duesseldorf',
    name: 'Düsseldorf',
    displayName: 'Düsseldorf',
    meta: {
      title: 'Messie-Hilfe Düsseldorf – Wohnung entrümpeln & reinigen',
      description:
        'Diskrete Messie-Hilfe in Düsseldorf ohne Bewertung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig.',
    },
    hero: {
      h1: 'Messie-Hilfe & Messie-Wohnung entrümpeln in Düsseldorf – diskret & anonym',
      text: 'Eine Messie-Wohnung zu entrümpeln ist für viele Betroffene und Angehörige eine schwere Aufgabe. Oft fehlt der Überblick, wo man anfangen soll – oder die Situation ist emotional zu belastend.\n\nWir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Düsseldorf – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe Düsseldorf – ruhig, diskret, strukturiert',
      text: 'Düsseldorf ist eine Stadt mit sehr unterschiedlichen Wohn- und Lebenssituationen. Wohnungen in gewachsenen Stadtstrukturen, langjährig genutzte Räume oder persönliche Veränderungen können dazu führen, dass Ordnung schrittweise verloren geht – oft unbemerkt.\n\nGerade hier ist ein respektvoller Umgang entscheidend. Unsere Messie-Hilfe in Düsseldorf setzt auf Diskretion, klare Abläufe und einen ruhigen Einstieg. Wir unterstützen strukturiert und ohne Bewertung – in dem Tempo, das sich richtig anfühlt.',
      image: duesseldorfImg,
    },
  },
  {
    slug: 'essen',
    name: 'Essen',
    displayName: 'Essen',
    meta: {
      title: 'Messie-Hilfe in Essen – Messie-Wohnung entrümpeln & reinigen',
      description:
        'Diskrete Messie-Hilfe in Essen ohne Bewertung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig. Jetzt anfragen',
    },
    hero: {
      h1: 'Messie-Hilfe & Messie-Wohnung entrümpeln in Essen – diskret & anonym',
      text: 'Eine Messie-Wohnung zu entrümpeln ist für viele Betroffene und Angehörige eine schwere Aufgabe. Oft fehlt der Überblick, wo man anfangen soll – oder die Situation ist emotional zu belastend.\n\nWir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Essen – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe in Essen – ruhig, diskret, strukturiert',
      text: 'Essen ist eine Stadt mit sehr unterschiedlichen Wohn- und Lebenssituationen. Wohnungen in gewachsenen Quartieren, langjährig genutzte Räume oder persönliche Veränderungen können dazu führen, dass Ordnung schrittweise verloren geht – oft unbemerkt.\n\nGerade hier ist ein respektvoller Umgang entscheidend. Unsere Messie-Hilfe in Essen setzt auf Diskretion, klare Abläufe und einen ruhigen Einstieg. Wir unterstützen strukturiert und ohne Bewertung – in dem Tempo, das sich richtig anfühlt.',
      image: essenImg,
    },
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((city) => city.slug === slug);
}

export function getCitySlugs(): string[] {
  return cities.map((city) => city.slug);
}
