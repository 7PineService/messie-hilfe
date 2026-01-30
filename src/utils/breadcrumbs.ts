import { SITE_NAME } from '@/config/site';

interface BreadcrumbItem {
  name: string;
  url: string;
}

const breadcrumbLabels: Record<string, string> = {
  '/agb/': 'AGB',
  '/impressum/': 'Impressum',
  '/standorte/': 'Standorte',
  '/ueber-uns/': 'Über uns',
  '/kontakt/': 'Kontakt',
  '/datenschutz/': 'Datenschutz',
  '/entruempelung/': 'Entrümpelung',
  '/messie-reinigung/': 'Messie-Reinigung',
  '/entsorgung/': 'Entsorgung',
  '/desinfektion/': 'Desinfektion',
  '/renovierung/': 'Renovierung',
  '/malerarbeiten/': 'Malerarbeiten',
  '/geruchsneutralisation/': 'Geruchsneutralisation',
  '/berlin/': 'Berlin',
  '/muenchen/': 'München',
  '/frankfurt/': 'Frankfurt',
  '/hamburg/': 'Hamburg',
  '/koeln/': 'Köln',
  '/essen/': 'Essen',
  '/duesseldorf/': 'Düsseldorf'
};

export function generateVisualBreadcrumbs(currentPath: string, title: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: SITE_NAME,
      url: "/"
    }
  ];

  if (currentPath === '/') {
    return breadcrumbs;
  }

  const pathSegments = currentPath.split('/').filter(Boolean);

  if (pathSegments.length === 1) {
    const normalizedPath = currentPath.endsWith('/') ? currentPath : currentPath + '/';
    breadcrumbs.push({
      name: breadcrumbLabels[normalizedPath] || title,
      url: currentPath
    });
  } else if (pathSegments.length > 1) {
    let accumulatedPath = '';
    pathSegments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      const pathWithSlash = accumulatedPath + '/';
      const isLast = index === pathSegments.length - 1;
      const label = breadcrumbLabels[pathWithSlash] || (isLast ? title : segment.charAt(0).toUpperCase() + segment.slice(1));

      breadcrumbs.push({
        name: label,
        url: pathWithSlash
      });
    });
  }

  return breadcrumbs;
}
