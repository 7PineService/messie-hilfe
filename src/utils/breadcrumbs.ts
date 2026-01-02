import { SITE_NAME } from '@/config/site';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateVisualBreadcrumbs(currentPath: string, title: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: SITE_NAME,
      url: "/"
    }
  ];

  if (currentPath === '/') {
    breadcrumbs.push({
      name: "Startseite",
      url: "/"
    });
    return breadcrumbs;
  }

  const pathSegments = currentPath.split('/').filter(Boolean);

  if (pathSegments.length === 1) {
    breadcrumbs.push({
      name: title,
      url: currentPath
    });
  } else if (pathSegments.length > 1) {
    let accumulatedPath = '';
    pathSegments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      breadcrumbs.push({
        name: isLast ? title : segment.charAt(0).toUpperCase() + segment.slice(1),
        url: accumulatedPath + '/'
      });
    });
  }

  return breadcrumbs;
}
