import "server-only";

import Stripe from "stripe";

import { env } from "./env";

const createStripe = async () => {
	return new Stripe(env.STRIPE_API_KEY);
};

export default await createStripe();
