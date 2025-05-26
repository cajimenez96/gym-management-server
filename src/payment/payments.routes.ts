import type { MemberRepository } from '@/member';
import type { MembershipPlanRepository } from '@/membership-plan';
import type {
	InitiatePaymentDto,
	PaymentRepository,
	PaymentService,
	PaymentsController,
} from '@/payment';
import type { SupabaseService } from '@/supabase';
import { authMiddleware } from '@/auth';
import { Router } from 'express';

interface PaymentRouterDependencies {
	supabaseService: SupabaseService;
	memberRepository: MemberRepository;
	paymentRepository: PaymentRepository;
	membershipPlansRepository: MembershipPlanRepository;
	paymentService: PaymentService;
	paymentsController: PaymentsController;
}

export const createPaymentsRouter = ({
	paymentsController,
}: PaymentRouterDependencies): Router => {
	const router = Router();

	// INITIATE PAYMENT - Solo owner (registro manual de pagos)
	router.post('/initiate', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await paymentsController.initiatePayment(req.body);
		res.status(200).json(result);
	});

	// CONFIRM PAYMENT - Solo owner
	router.post('/confirm/:paymentIntentId', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await paymentsController.confirmPayment(req.params.paymentIntentId);
		res.json(result);
	});

	// GET PAYMENT HISTORY - Solo owner
	router.get('/', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await paymentsController.getPaymentHistory();
		res.json(result);
	});

	return router;
};
