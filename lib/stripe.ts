import Stripe from "stripe";

const createStripe = () => {
	if (!process.env.STRIPE_TEST_MODE_API_KEY)
		throw Error(".envファイルにSTRIPE_TEST_MODE_API_KEYを追記してください");
	return new Stripe(process.env.STRIPE_TEST_MODE_API_KEY);
};

export default createStripe();
