import Stripe from 'stripe';

export class StripeService {
	private stripe: Stripe;

	constructor() {
		this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: '2024-06-20', // Use the latest API version
		});
	}

	async createPaymentIntent(
		amount: number,
		currency: string,
	): Promise<Stripe.PaymentIntent> {
		return this.stripe.paymentIntents.create({
			amount,
			currency,
			payment_method_types: ['card'],
		});
	}
}
