#!/usr/bin/env node
/**
 * Environment Variable Validation Script
 * Run this script to validate environment variables before building
 * Usage: node scripts/validate-env.js
 * 
 * This script can be run standalone or as part of the build process.
 * 
 * Vercel Compatibility:
 * - Works in Vercel deployments (environment variables are injected into process.env)
 * - Automatically runs during `npm run build` (called via prebuild hook)
 * - Validates variables set in Vercel dashboard
 * - No .env file needed in Vercel (variables are set in dashboard)
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Detect if running in Vercel (or other CI environment)
const isVercel = process.env.VERCEL === '1' || process.env.CI === 'true';
const isLocal = !isVercel;

// Load environment variables from .env file if it exists (local development only)
const envPath = join(projectRoot, '.env');
if (existsSync(envPath) && isLocal) {
	try {
		const envFile = readFileSync(envPath, 'utf-8');
		const envLines = envFile.split('\n');
		
		envLines.forEach(line => {
			const trimmed = line.trim();
			if (trimmed && !trimmed.startsWith('#')) {
				const [key, ...valueParts] = trimmed.split('=');
				if (key && valueParts.length > 0) {
					const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
					process.env[key.trim()] = value;
				}
			}
		});
		console.log('ℹ️  Loaded environment variables from .env file\n');
	} catch (error) {
		console.warn(`⚠️  Could not read .env file: ${error.message}\n`);
	}
} else if (isVercel) {
	console.log('ℹ️  Running in Vercel - using environment variables from Vercel dashboard\n');
} else {
	console.log('ℹ️  No .env file found, checking process.env only\n');
}

// Validation rules
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
			if (!val.startsWith('GTM-')) {
				return 'Must start with "GTM-"';
			}
			return null;
		}
	},
	{
		name: 'PUBLIC_GA4_MEASUREMENT_ID',
		validate: (val) => {
			if (!val) return 'Required for tracking';
			if (!val.startsWith('G-')) {
				return 'Must start with "G-"';
			}
			return null;
		}
	}
];

const recommendedVars = [
	{
		name: 'PUBLIC_CONTACT_API_ENDPOINT',
		validate: (val) => {
			if (val && !val.startsWith('http://') && !val.startsWith('https://')) {
				return 'Must be a valid URL (http:// or https://)';
			}
			return null;
		}
	}
];

// Run validation
const errors = [];
const warnings = [];

console.log('🔍 Validating Environment Variables...\n');

// Check required variables
requiredVars.forEach(({ name, validate }) => {
	const value = process.env[name];
	const error = validate(value);
	if (error) {
		errors.push({ name, error, value: value || '(not set)' });
	} else {
		console.log(`✅ ${name}: ${value || '(using default)'}`);
	}
});

console.log('');

// Check recommended variables
recommendedVars.forEach(({ name, validate }) => {
	const value = process.env[name];
	const error = validate(value);
	if (error) {
		warnings.push({ name, error, value: value || '(not set)' });
	} else if (value) {
		console.log(`✅ ${name}: ${value}`);
	} else {
		console.log(`⚠️  ${name}: Not set (optional)`);
	}
});

// Check CookieYes (required if enabled)
const cookieYesUrl = process.env.PUBLIC_COOKIEYES_SCRIPT_URL;
const cookieYesEnabled = process.env.PUBLIC_COOKIEYES_ENABLED !== 'false';
if (cookieYesEnabled && !cookieYesUrl) {
	errors.push({ name: 'PUBLIC_COOKIEYES_SCRIPT_URL', error: 'Required when PUBLIC_COOKIEYES_ENABLED is true', value: '(not set)' });
}
if (cookieYesUrl && !cookieYesUrl.startsWith('https://')) {
	errors.push({ name: 'PUBLIC_COOKIEYES_SCRIPT_URL', error: 'Must use HTTPS', value: cookieYesUrl });
}

console.log('');

// Report results
if (errors.length > 0) {
	console.error('❌ Validation Errors:\n');
	errors.forEach(({ name, error, value }) => {
		console.error(`  • ${name}: ${error}`);
		console.error(`    Current value: ${value}\n`);
	});
	process.exit(1);
}

if (warnings.length > 0) {
	console.warn('⚠️  Validation Warnings:\n');
	warnings.forEach(({ name, error, value }) => {
		console.warn(`  • ${name}: ${error}`);
		console.warn(`    Current value: ${value}\n`);
	});
}

if (errors.length === 0 && warnings.length === 0) {
	console.log('✅ All environment variables are valid!\n');
	process.exit(0);
}

process.exit(0);

