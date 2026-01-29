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
        'Diskrete Messie-Hilfe in Berlin und Umgebung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig. Jetzt anfragen.',
    },
    hero: {
      h1: 'Diskrete Messie-Hilfe & Messie-Entrümpelung in Berlin',
      text: 'Eine <strong>Messie-Wohnung zu entrümpeln</strong> ist für viele Betroffene und Angehörige eine schwere Aufgabe. Oft fehlt der Überblick, wo man anfangen soll – oder die Situation ist emotional zu belastend. Gerade in einer Großstadt wie Berlin kommen Zeitdruck und räumliche Enge häufig hinzu.\n\n<strong>Wir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Berlin</strong> – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe in Berlin – diskret, strukturiert und ohne Bewertung',
      text: 'Berlin ist geprägt von unterschiedlichen Wohn- und Lebenssituationen. In vielen Fällen entwickeln sich Herausforderungen rund um <strong>Messie-Wohnungen in Berlin</strong> schrittweise und bleiben lange unbemerkt – auch durch die anonyme Struktur der Stadt.\n\nGerade bei Mehrfamilienhäusern und direkter Nachbarschaft ist Diskretion entscheidend. <strong>Unsere Messie-Hilfe in Berlin</strong> unterstützt bei Entrümpelung und Reinigung <strong>ohne Bewertung</strong> – strukturiert, respektvoll und angepasst an die jeweilige Wohnsituation.',
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
        'Diskrete Messie-Hilfe in München & Umgebung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig. Jetzt anfragen.',
    },
    hero: {
      h1: 'Diskrete Messie-Hilfe & Messie-Entrümpelung in München',
      text: 'Eine <strong>Messie-Wohnung zu entrümpeln</strong> ist für viele Betroffene und Angehörige eine große Belastung. Oft entsteht zusätzlicher Druck durch Erwartungen von außen – etwa von Familie, Nachbarn oder Vermietern.\n\n<strong>Wir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in München</strong> – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe in München – diskret, strukturiert und ohne Bewertung',
      text: 'München ist geprägt von dichtem Wohnraum, hohen Erwartungen an Ordnung und einer vergleichsweise geringen Anonymität. Probleme rund um <strong>Messie-Wohnungen in München</strong> werden dadurch oft lange verdeckt – aus Sorge vor Konsequenzen oder dem Verlust von Wohnraum.\n\nGerade in Eigentümergemeinschaften, gepflegten Mehrfamilienhäusern oder bei sensiblen Nachbarschaften ist ein zurückhaltendes Vorgehen entscheidend. <strong>Unsere Messie-Hilfe in München</strong> unterstützt bei Entrümpelung und Reinigung <strong>ohne Bewertung</strong> – strukturiert, diskret und angepasst an die jeweilige Wohnsituation.',
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
        'Diskrete Messie-Hilfe in Hamburg & Umgebung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig. Jetzt anfragen.',
    },
    hero: {
      h1: 'Diskrete Messie-Hilfe & Messie-Entrümpelung in Hamburg',
      text: 'Eine <strong>Messie-Wohnung zu entrümpeln</strong> ist für viele Betroffene und Angehörige eine große Herausforderung. In Hamburg kommen häufig ältere Bausubstanz, Feuchtigkeit oder lang genutzte Räume hinzu, die Ordnung zusätzlich erschweren.\n\n<strong>Wir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Hamburg</strong> – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe in Hamburg – diskret, strukturiert und ohne Bewertung',
      text: 'Hamburg ist geprägt von vielen Altbauwohnungen, Kellerräumen und über Jahre genutzten Wohnflächen. Herausforderungen rund um <strong>Messie-Wohnungen in Hamburg</strong> entstehen häufig schleichend – begünstigt durch Feuchtigkeit, begrenzten Stauraum oder langjährige Nutzung ohne Veränderung.\n\nGerade in Mehrfamilienhäusern mit gemeinschaftlichen Kellern oder enger Nachbarschaft ist ein ruhiges Vorgehen wichtig. <strong>Unsere Messie-Hilfe in Hamburg</strong> unterstützt bei Entrümpelung und Reinigung <strong>ohne Bewertung</strong> – strukturiert, diskret und angepasst an die jeweilige Wohnsituation.',
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
        'Diskrete Messie-Hilfe in Köln und Umgebung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig. Jetzt anfragen.',
    },
    hero: {
      h1: 'Diskrete Messie-Hilfe & Messie-Entrümpelung in Köln',
      text: 'Eine <strong>Messie-Wohnung zu entrümpeln</strong> ist für viele Betroffene und Angehörige eine große Belastung. In Köln spielen persönliche Nähe, Familie und ein enger sozialer Austausch häufig eine zusätzliche Rolle.\n\n<strong>Wir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Köln</strong> – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe in Köln – diskret, strukturiert und ohne Bewertung',
      text: 'Köln ist geprägt von gewachsenen Vierteln, enger Nachbarschaft und starken sozialen Bindungen. Herausforderungen rund um <strong>Messie-Wohnungen in Köln</strong> werden oft lange zurückgehalten – aus Rücksicht auf Familie, Freunde oder das direkte Umfeld.\n\nGerade wenn mehrere Personen eingebunden sind oder Erwartungen von außen bestehen, ist ein respektvoller Umgang entscheidend. <strong>Unsere Messie-Hilfe in Köln</strong> unterstützt bei Entrümpelung und Reinigung <strong>ohne Bewertung</strong> – ruhig, strukturiert und angepasst an die jeweilige Situation.',
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
        'Diskrete Messie-Hilfe in Frankfurt & Umgebung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig. Jetzt anfragen.',
    },
    hero: {
      h1: 'Diskrete Messie-Hilfe & Messie-Entrümpelung in Frankfurt',
      text: 'Eine <strong>Messie-Wohnung zu entrümpeln</strong> ist für viele Betroffene und Angehörige eine enorme Belastung. In einer Stadt wie Frankfurt kommt häufig zusätzlicher Druck durch Zeitmangel, berufliche Anforderungen oder anstehende Wohnungswechsel hinzu.\n\n<strong>Wir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Frankfurt</strong> – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe in Frankfurt – diskret, strukturiert und ohne Bewertung',
      text: 'Frankfurt ist geprägt von dichter Bebauung, häufigen Wohnungswechseln und einem hohen beruflichen Tempo. Herausforderungen rund um <strong>Messie-Wohnungen in Frankfurt</strong> entstehen oft parallel zu Arbeit, Trennung oder kurzfristigen Veränderungen – Zeit für Ordnung bleibt kaum.\n\nGerade bei begrenzten Zeitfenstern, sensiblen Mietverhältnissen oder Hausverwaltungen ist ein klar strukturiertes Vorgehen entscheidend. <strong>Unsere Messie-Hilfe in Frankfurt</strong> unterstützt bei Entrümpelung und Reinigung <strong>ohne Bewertung</strong> – effizient, diskret und an die jeweilige Situation angepasst.',
      image: frankfurtImg,
    },
  },
  {
    slug: 'duesseldorf',
    name: 'Düsseldorf',
    displayName: 'Düsseldorf',
    meta: {
      title: 'Messie-Hilfe in Düsseldorf – Wohnung entrümpeln & reinigen',
      description:
        'Diskrete Messie-Hilfe in Düsseldorf und Umgebung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig.',
    },
    hero: {
      h1: 'Diskrete Messie-Hilfe & Messie-Entrümpelung in Düsseldorf',
      text: 'Eine <strong>Messie-Wohnung zu entrümpeln</strong> ist für viele Betroffene und Angehörige eine sensible Situation. In Düsseldorf spielt dabei häufig der Wunsch nach Zurückhaltung und äußerer Ordnung eine besondere Rolle.\n\n<strong>Wir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Düsseldorf</strong> – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe in Düsseldorf – diskret, strukturiert und ohne Bewertung',
      text: 'Düsseldorf ist geprägt von gepflegten Wohnvierteln, Mehrfamilienhäusern und klaren Erwartungen an Ordnung und Auftreten. Herausforderungen rund um <strong>Messie-Wohnungen in Düsseldorf</strong> werden daher oft lange verborgen – aus Sorge vor Reaktionen von Nachbarn oder Hausverwaltungen.\n\nGerade in sensiblen Hausgemeinschaften oder bei verwalteten Wohnanlagen ist ein ruhiges Vorgehen entscheidend. <strong>Unsere Messie-Hilfe in Düsseldorf</strong> unterstützt bei Entrümpelung und Reinigung <strong>ohne Bewertung</strong> – strukturiert, zurückhaltend und an die jeweilige Wohnsituation angepasst.',
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
        'Diskrete Messie-Hilfe in Essen und Umgebung. Unterstützung bei Entrümpelung & Reinigung von Messie-Wohnungen – anonym & zuverlässig. Jetzt anfragen.',
    },
    hero: {
      h1: 'Diskrete Messie-Hilfe & Messie-Entrümpelung in Essen',
      text: 'Eine <strong>Messie-Wohnung zu entrümpeln</strong> ist für viele Betroffene und Angehörige eine große Herausforderung. In Essen betrifft dies häufig Häuser, Keller, Garagen oder über Jahre genutzte Räume mit umfangreichem Bestand.\n\n<strong>Wir helfen bei der Entrümpelung und Reinigung von Messie-Wohnungen in Essen</strong> – diskret, anonym und mit klaren Abläufen.',
    },
    cityContext: {
      h2: 'Messie-Hilfe in Essen – diskret, strukturiert und ohne Bewertung',
      text: 'Essen ist geprägt von Wohnhäusern, ehemaligen Zechensiedlungen und über lange Zeit genutzten Immobilien. Herausforderungen rund um <strong>Messie-Wohnungen in Essen</strong> entstehen häufig über viele Jahre hinweg – mit großen Mengen, Nebenräumen und starkem Bestand.\n\nGerade bei Kellern, Garagen oder generationenübergreifend genutzten Häusern ist ein strukturiertes Vorgehen entscheidend. <strong>Unsere Messie-Hilfe in Essen</strong> unterstützt bei Entrümpelung und Reinigung <strong>ohne Bewertung</strong> – ruhig, nachvollziehbar und angepasst an die jeweilige Wohnsituation.',
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
