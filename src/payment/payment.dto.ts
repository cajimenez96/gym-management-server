export interface InitiatePaymentDto {
	memberId: string;

	amount: number;

	planId: string;
}

export interface CreatePaymentResponse {
	paymentId: string;

	clientSecret: string;

	paymentIntentId: string;
}
