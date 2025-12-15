// Site Configuration
// Centralized site-wide settings from environment variables
import { validateEnvVariables } from './env-validation';

// Validate environment variables (warnings only in dev, errors in production)
const isProduction = import.meta.env.PROD;
const envValidation = validateEnvVariables(isProduction);

if (envValidation.errors.length > 0) {
	console.error('\n❌ Environment Variable Validation Errors:\n');
	envValidation.errors.forEach(error => {
		console.error(`  • ${error}`);
	});
	console.error('\nPlease set the required environment variables in your .env file or deployment platform.\n');
	if (isProduction) {
		throw new Error('Environment variable validation failed. Please fix the errors above.');
	}
}

if (envValidation.warnings.length > 0 && import.meta.env.DEV) {
	console.warn('\n⚠️  Environment Variable Warnings:\n');
	envValidation.warnings.forEach(warning => {
		console.warn(`  • ${warning}`);
	});
	console.warn('');
}

// Site URL (canonical URL)
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://messie-hilfe.de';

// Contact Information
export const CONTACT_PHONE = import.meta.env.PUBLIC_CONTACT_PHONE || '+498001234567890';
export const CONTACT_PHONE_DISPLAY = import.meta.env.PUBLIC_CONTACT_PHONE_DISPLAY || '0800-1234-5678-90';
export const CONTACT_EMAIL = import.meta.env.PUBLIC_CONTACT_EMAIL || 'info@messie-hilfe.de';
export const CONTACT_WHATSAPP = import.meta.env.PUBLIC_CONTACT_WHATSAPP || '498001234567890';

// Social Media
export const TWITTER_HANDLE = import.meta.env.PUBLIC_TWITTER_HANDLE || '@messiehilfe';

// Site Name
export const SITE_NAME = import.meta.env.PUBLIC_SITE_NAME || 'Messie-Hilfe';

// Contact Form API Endpoint (optional - for form submissions)
export const CONTACT_API_ENDPOINT = import.meta.env.PUBLIC_CONTACT_API_ENDPOINT || undefined;

