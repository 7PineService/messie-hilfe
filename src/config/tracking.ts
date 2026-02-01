const GTM_CONTAINER_ID = import.meta.env.PUBLIC_GTM_CONTAINER_ID;
if (!GTM_CONTAINER_ID) {
	throw new Error('PUBLIC_GTM_CONTAINER_ID is required but not set');
}

export const GA4_MEASUREMENT_ID = import.meta.env.PUBLIC_GA4_MEASUREMENT_ID;
if (!GA4_MEASUREMENT_ID) {
	throw new Error('PUBLIC_GA4_MEASUREMENT_ID is required but not set');
}

const cookieYesEnvUrl = import.meta.env.PUBLIC_COOKIEYES_SCRIPT_URL;
export const COOKIEYES_SCRIPT_URL = cookieYesEnvUrl || 'https://cdn-cookieyes.com/client_data/210033cfb1e121b1e704a1033cdc5994/script.js';

export const COOKIEYES_ENABLED = import.meta.env.PUBLIC_COOKIEYES_ENABLED !== 'false' && COOKIEYES_SCRIPT_URL !== '';

export const getGTMContainerId = (hostname?: string): string => {
	return GTM_CONTAINER_ID;
};

export const shouldExcludeTracking = (pathname: string): boolean => {
	const excludedPaths = ['/impressum', '/datenschutz', '/cookie', '/consent'];
	return excludedPaths.some(path => pathname.startsWith(path));
};

