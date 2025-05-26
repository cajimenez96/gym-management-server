export interface InitiatePaymentDto {
	memberId: string;

	amount: number;

	planId: string;
}

export interface CreatePaymentResponse {
	paymentId: string;

	clientSecret?: string | null; // Optional for backward compatibility

	paymentIntentId?: string | null; // Optional for backward compatibility

	message?: string; // For manual payment messages
}
