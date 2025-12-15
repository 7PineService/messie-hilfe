// Tracking Configuration
// Centralized configuration for GTM, GA4, and consent tools
// Reads from environment variables (PUBLIC_* prefix for client-side access)
import { validateEnvVariables } from './env-validation';

// Validate tracking-related environment variables
const isProduction = import.meta.env.PROD;
const envValidation = validateEnvVariables(isProduction);

// Log errors for tracking variables (required)
if (envValidation.errors.length > 0 && import.meta.env.DEV) {
	const trackingErrors = envValidation.errors.filter(e => 
		e.includes('PUBLIC_GTM_CONTAINER_ID') || 
		e.includes('PUBLIC_GA4_MEASUREMENT_ID') || 
		e.includes('PUBLIC_COOKIEYES')
	);
	if (trackingErrors.length > 0) {
		console.error('❌ Tracking Configuration Errors:');
		trackingErrors.forEach(error => console.error(`  • ${error}`));
	}
}

// Log warnings for tracking variables in dev mode
if (envValidation.warnings.length > 0 && import.meta.env.DEV) {
	const trackingWarnings = envValidation.warnings.filter(w => 
		w.includes('PUBLIC_GTM_CONTAINER_ID') || 
		w.includes('PUBLIC_GA4_MEASUREMENT_ID') || 
		w.includes('PUBLIC_COOKIEYES')
	);
	if (trackingWarnings.length > 0) {
		console.warn('⚠️  Tracking Configuration Warnings:');
		trackingWarnings.forEach(warning => console.warn(`  • ${warning}`));
	}
}

// GTM Container ID from environment variable (single variable for all environments)
// Required - validation will fail if not set
const GTM_CONTAINER_ID = import.meta.env.PUBLIC_GTM_CONTAINER_ID;
if (!GTM_CONTAINER_ID) {
	throw new Error('PUBLIC_GTM_CONTAINER_ID is required but not set');
}

// GA4 Measurement ID (for reference, configured in GTM)
// Required - validation will fail if not set
export const GA4_MEASUREMENT_ID = import.meta.env.PUBLIC_GA4_MEASUREMENT_ID;
if (!GA4_MEASUREMENT_ID) {
	throw new Error('PUBLIC_GA4_MEASUREMENT_ID is required but not set');
}

// CookieYes Script URL (optional - set to empty string to disable)
// Uses default fallback if not set
const cookieYesEnvUrl = import.meta.env.PUBLIC_COOKIEYES_SCRIPT_URL;
export const COOKIEYES_SCRIPT_URL = cookieYesEnvUrl || 'https://cdn-cookieyes.com/client_data/210033cfb1e121b1e704a1033cdc5994/script.js';

// CookieYes enabled state (checks raw env var, not fallback)
// Only enabled if explicitly not disabled AND URL is provided (from env or default)
export const COOKIEYES_ENABLED = import.meta.env.PUBLIC_COOKIEYES_ENABLED !== 'false' && COOKIEYES_SCRIPT_URL !== '';

// Get current GTM Container ID
// Uses the same GTM Container ID for all environments
// Environment detection is handled by GTM itself (separate GTM containers for prod/staging)
export const getGTMContainerId = (hostname?: string): string => {
	return GTM_CONTAINER_ID;
};

// Check if page should exclude tracking
export const shouldExcludeTracking = (pathname: string): boolean => {
	const excludedPaths = ['/impressum', '/datenschutz', '/cookie', '/consent'];
	return excludedPaths.some(path => pathname.startsWith(path));
};

