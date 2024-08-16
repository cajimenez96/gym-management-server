import { Router } from 'express';
import { SupabaseService } from '@/supabase';
import { MemberRepository } from '@/member';
import { MembershipPlanRepository } from '@/membership-plan';
import { StripeService } from '@/stripe';
import {
  PaymentsController,
  PaymentRepository,
  PaymentService,
  InitiatePaymentDto,
} from '@/payment';

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
