import type {
	CreatePaymentResponse,
	InitiatePaymentDto,
	Payment,
	PaymentService,
} from '@/payment';

export class PaymentsController {
	constructor(private readonly paymentService: PaymentService) {}

	async initiatePayment(
		initiatePaymentDto: InitiatePaymentDto,
	): Promise<CreatePaymentResponse> {
		if (initiatePaymentDto.amount <= 0) {
			throw new Error('Payment amount must be greater than zero');
		}
		return this.paymentService.createPayment(
			initiatePaymentDto.memberId,
			initiatePaymentDto.planId,
			initiatePaymentDto.amount,
		);
	}

	async confirmPayment(paymentIntentId: string): Promise<Payment> {
		return this.paymentService.confirmPayment(paymentIntentId);
	}

	async getPaymentHistory(memberId?: string): Promise<Payment[]> {
		return this.paymentService.getPaymentHistory(memberId);
	}
}
