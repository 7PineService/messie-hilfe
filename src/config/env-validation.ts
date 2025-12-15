// Environment Variable Validation
// Validates required and optional environment variables at build time
// Provides helpful error messages for missing or invalid values

interface ValidationResult {
	valid: boolean;
	errors: string[];
	warnings: string[];
}

/**
 * Validates environment variables
 * @param isProduction - Whether we're in production build
 * @returns Validation result with errors and warnings
 */
export function validateEnvVariables(isProduction: boolean = false): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Required environment variables
	const requiredVars = [
		{
			name: 'PUBLIC_SITE_URL',
			value: import.meta.env.PUBLIC_SITE_URL,
			validate: (val: string | undefined) => {
				if (!val) return 'PUBLIC_SITE_URL is required';
				if (!val.startsWith('http://') && !val.startsWith('https://')) {
					return 'PUBLIC_SITE_URL must be a valid URL starting with http:// or https://';
				}
				return null;
			}
		},
		{
			name: 'PUBLIC_SITE_NAME',
			value: import.meta.env.PUBLIC_SITE_NAME,
			validate: (val: string | undefined) => {
				if (!val) return 'PUBLIC_SITE_NAME is required';
				return null;
			}
		},
		{
			name: 'PUBLIC_CONTACT_EMAIL',
			value: import.meta.env.PUBLIC_CONTACT_EMAIL,
			validate: (val: string | undefined) => {
				if (!val) return 'PUBLIC_CONTACT_EMAIL is required';
				if (!val.includes('@')) {
					return 'PUBLIC_CONTACT_EMAIL must be a valid email address';
				}
				return null;
			}
		},
		{
			name: 'PUBLIC_CONTACT_PHONE',
			value: import.meta.env.PUBLIC_CONTACT_PHONE,
			validate: (val: string | undefined) => {
				if (!val) return 'PUBLIC_CONTACT_PHONE is required';
				return null;
			}
		},
		{
			name: 'PUBLIC_GTM_CONTAINER_ID',
			value: import.meta.env.PUBLIC_GTM_CONTAINER_ID,
			validate: (val: string | undefined) => {
				if (!val) return 'PUBLIC_GTM_CONTAINER_ID is required for tracking';
				if (!val.startsWith('GTM-')) {
					return 'PUBLIC_GTM_CONTAINER_ID must start with "GTM-"';
				}
				return null;
			}
		},
		{
			name: 'PUBLIC_GA4_MEASUREMENT_ID',
			value: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID,
			validate: (val: string | undefined) => {
				if (!val) return 'PUBLIC_GA4_MEASUREMENT_ID is required for tracking';
				if (!val.startsWith('G-')) {
					return 'PUBLIC_GA4_MEASUREMENT_ID must start with "G-"';
				}
				return null;
			}
		}
	];

	// Optional but recommended environment variables
	const recommendedVars = [
		{
			name: 'PUBLIC_CONTACT_API_ENDPOINT',
			value: import.meta.env.PUBLIC_CONTACT_API_ENDPOINT,
			validate: (val: string | undefined) => {
				if (val && !val.startsWith('http://') && !val.startsWith('https://')) {
					return 'PUBLIC_CONTACT_API_ENDPOINT must be a valid URL starting with http:// or https://';
				}
				return null;
			}
		}
	];

	// Validate required variables
	requiredVars.forEach(({ name, value, validate }) => {
		const error = validate(value);
		if (error) {
			errors.push(`${name}: ${error}`);
		}
	});

	// Validate recommended variables (warnings only)
	recommendedVars.forEach(({ name, value, validate }) => {
		if (value) {
			const error = validate(value);
			if (error) {
				warnings.push(`${name}: ${error}`);
			}
		}
	});

	// Validate CookieYes configuration (required if enabled)
	const cookieYesUrl = import.meta.env.PUBLIC_COOKIEYES_SCRIPT_URL;
	const cookieYesEnabled = import.meta.env.PUBLIC_COOKIEYES_ENABLED !== 'false';
	
	if (cookieYesEnabled && !cookieYesUrl) {
		errors.push('PUBLIC_COOKIEYES_ENABLED is true but PUBLIC_COOKIEYES_SCRIPT_URL is not set');
	}
	if (cookieYesUrl && !cookieYesUrl.startsWith('https://')) {
		errors.push('PUBLIC_COOKIEYES_SCRIPT_URL must use HTTPS');
	}

	// Validate Twitter handle format
	const twitterHandle = import.meta.env.PUBLIC_TWITTER_HANDLE;
	if (twitterHandle && !twitterHandle.startsWith('@')) {
		warnings.push('PUBLIC_TWITTER_HANDLE should start with "@" (e.g., @username)');
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings
	};
}

/**
 * Validates and logs environment variables
 * Call this during build or at app startup
 */
export function validateAndLogEnv(isProduction: boolean = false): void {
	const result = validateEnvVariables(isProduction);

	if (result.errors.length > 0) {
		console.error('\n❌ Environment Variable Validation Errors:\n');
		result.errors.forEach(error => {
			console.error(`  • ${error}`);
		});
		console.error('\nPlease set the required environment variables in your .env file or deployment platform.\n');
		
		if (isProduction) {
			throw new Error('Environment variable validation failed. Please fix the errors above.');
		}
	}

	if (result.warnings.length > 0) {
		console.warn('\n⚠️  Environment Variable Warnings:\n');
		result.warnings.forEach(warning => {
			console.warn(`  • ${warning}`);
		});
		console.warn('');
	}

	if (result.valid && result.warnings.length === 0) {
		console.log('✅ All environment variables validated successfully\n');
	}
}

