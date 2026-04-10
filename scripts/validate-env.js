import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const isVercel = process.env.VERCEL === '1' || process.env.CI === 'true';
const isLocal = !isVercel;

const envPath = join(projectRoot, '.env');
if (existsSync(envPath) && isLocal) {
	try {
		const envFile = readFileSync(envPath, 'utf-8');
		envFile.split('\n').forEach(line => {
			const trimmed = line.trim();
			if (trimmed && !trimmed.startsWith('#')) {
				const [key, ...valueParts] = trimmed.split('=');
				if (key && valueParts.length > 0) {
					const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
					process.env[key.trim()] = value;
				}
			}
		});
	} catch (error) {
		console.warn(`⚠️  Could not read .env file: ${error.message}\n`);
	}
}

const requiredVars = [
	{
		name: 'PUBLIC_SITE_URL',
		validate: (val) => {
			if (!val) return 'Required';
			if (!val.startsWith('http://') && !val.startsWith('https://')) {
				return 'Must be a valid URL (http:// or https://)';
			}
			return null;
		}
	},
	{
		name: 'PUBLIC_SITE_NAME',
		validate: (val) => val ? null : 'Required'
	},
	{
		name: 'PUBLIC_CONTACT_EMAIL',
		validate: (val) => {
			if (!val) return 'Required';
			if (!val.includes('@')) return 'Must be a valid email address';
			return null;
		}
	},
	{
		name: 'PUBLIC_CONTACT_PHONE',
		validate: (val) => val ? null : 'Required'
	},
	{
		name: 'PUBLIC_GTM_CONTAINER_ID',
		validate: (val) => {
			if (!val) return 'Required for tracking';
			if (!val.startsWith('GTM-')) return 'Must start with "GTM-"';
			return null;
		}
	},
	{
		name: 'PUBLIC_GA4_MEASUREMENT_ID',
		validate: (val) => {
			if (!val) return 'Required for tracking';
			if (!val.startsWith('G-')) return 'Must start with "G-"';
			return null;
		}
	}
];

const errors = [];

console.log('🔍 Validating Environment Variables...\n');

requiredVars.forEach(({ name, validate }) => {
	const value = process.env[name];
	const error = validate(value);
	if (error) {
		errors.push({ name, error, value: value || '(not set)' });
	} else {
		console.log(`✅ ${name}: ${value}`);
	}
});

console.log('');

if (errors.length > 0) {
	console.error('❌ Validation Errors:\n');
	errors.forEach(({ name, error, value }) => {
		console.error(`  • ${name}: ${error}`);
		console.error(`    Current value: ${value}\n`);
	});
	process.exit(1);
}

console.log('✅ All environment variables are valid!\n');
process.exit(0);
