import { validateEnvVariables } from './env-validation';

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

export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://messie-hilfe.de';

export const CONTACT_PHONE = '+4989120891335';
export const CONTACT_PHONE_DISPLAY = '089 120 891 335';
export const CONTACT_EMAIL = 'kontakt@messie-hilfe.de';
export const CONTACT_WHATSAPP = '4989370497772';

export const TWITTER_HANDLE = import.meta.env.PUBLIC_TWITTER_HANDLE || '@messiehilfe';

export const SITE_NAME = import.meta.env.PUBLIC_SITE_NAME || 'Messie-Hilfe';

export const CONTACT_API_ENDPOINT = '/api/contact';
export const LEAD_API_ENDPOINT = '/api/lead';

