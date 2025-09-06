export const SERVICE_DOMAIN = "http://localhost:3000";
export const SIGN_IN_PATH = "/api/auth/sign-in";
export const HOSTED_UI_DOMAIN =
	"https://[a-z0-9-]+\.auth\.ap-northeast-1\.amazoncognito\.com\/login";
export const HOSTED_UI_DOMAIN_REGEX = new RegExp(HOSTED_UI_DOMAIN);
export const TEST_API_ENDPOINT = `${SERVICE_DOMAIN}/api/test`;
export const GET_CURRENT_USER_ENDPOINT = `${TEST_API_ENDPOINT}/get-current-user`;
export const DELETE_PURCHASE_HISTORY_ENDPOINT = `${TEST_API_ENDPOINT}/delete-purchase-history`;
export const FETCH_AUTH_SESSION_ENDPOINT = `${TEST_API_ENDPOINT}/fetch-auth-session`;
export const STRIPE_WEBHOOK_ENDPOINT = `${SERVICE_DOMAIN}/api/webhook/stripe`;
