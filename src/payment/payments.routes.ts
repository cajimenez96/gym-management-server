import type { MemberRepository } from '@/member';
import type { MembershipPlanRepository } from '@/membership-plan';
import type {
	InitiatePaymentDto,
	PaymentRepository,
	PaymentService,
	PaymentsController,
} from '@/payment';
import type { StripeService } from '@/stripe';
import type { SupabaseService } from '@/supabase';
import { Router } from 'express';

interface PaymentRouterDependencies {
	supabaseService: SupabaseService;
	memberRepository: MemberRepository;
	paymentRepository: PaymentRepository;
	membershipPlansRepository: MembershipPlanRepository;
	stripeService: StripeService;
	paymentService: PaymentService;
	paymentsController: PaymentsController;
}

export const createPaymentsRouter = ({
	paymentsController,
}: PaymentRouterDependencies): Router => {
	const router = Router();

	router.post<unknown, unknown, InitiatePaymentDto>(
		'/initiate',
		async (req, res) => {
			const result = await paymentsController.initiatePayment(req.body);
			res.status(200).json(result);
		},
	);

	router.post<
		{
			paymentIntentId: string;
		},
		unknown,
		unknown
	>('/confirm/:paymentIntentId', async (req, res) => {
		const result = await paymentsController.confirmPayment(
			req.params.paymentIntentId,
		);
		res.json(result);
	});

	router.get('/', async (req, res) => {
		const result = await paymentsController.getPaymentHistory();
		res.json(result);
	});

	return router;
};
