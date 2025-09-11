export const SERVICE_DOMAIN = "http://localhost:3000";
export const SIGN_IN_PATH = "/api/auth/sign-in";
export const HOSTED_UI_DOMAIN =
	"https://[a-z0-9-]+\.auth\.ap-northeast-1\.amazoncognito\.com\/login";
export const HOSTED_UI_DOMAIN_REGEX = new RegExp(HOSTED_UI_DOMAIN);
export const TEST_API_ENDPOINT = `${SERVICE_DOMAIN}/api/test`;
export const CREATE_PURCHASE_HISTORY_ENDPOINT = `${TEST_API_ENDPOINT}/create-purchase-history`;
export const DELETE_PURCHASE_HISTORY_ENDPOINT = `${TEST_API_ENDPOINT}/delete-purchase-history`;
export const CREATE_TEST_USER_ENDPOINT = `${TEST_API_ENDPOINT}/create-test-user`;
export const DELETE_TEST_USER_ENDPOINT = `${TEST_API_ENDPOINT}/delete-test-user`;
export const FETCH_USER_ATTRIBUTE_ENDPOINT = `${TEST_API_ENDPOINT}/fetch-user-attribute`;
export const STRIPE_WEBHOOK_ENDPOINT = `${SERVICE_DOMAIN}/api/webhook/stripe`;
export const TEST_SPEC_FILES_DIR =
	"e2e/playwright/test/spec/with-precreated-user";
export const TEST_SPEC_FILES_GLOB = `${TEST_SPEC_FILES_DIR}/**/*.spec.ts`;
