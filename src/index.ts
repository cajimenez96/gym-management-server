import bodyParser from 'body-parser';
import cors from 'cors';
import { NextFunction, Request, Response } from 'express';
import {
  CheckInRepository,
  CheckInsController,
  CheckInService,
  createCheckInsRouter,
} from '@/check-in';
import {
  createMembersRouter,
  MemberRepository,
  MembersController,
  MemberService,
} from '@/member';
import {
  createMembershipPlansRouter,
  MembershipPlanRepository,
  MembershipPlansController,
  MembershipPlanService,
} from '@/membership-plan';
import {
  createPaymentsRouter,
  PaymentRepository,
  PaymentsController,
  PaymentService,
} from '@/payment';
import { SupabaseService } from '@/supabase';
import { StripeService } from '@/stripe';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');

const app = express();
const port = process.env.PORT || 3002;

// Set up middleware
app.use(bodyParser.json()); // Parses incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS)

// Set up dependencies
const supabaseService = new SupabaseService();

// Member
const memberRepository = new MemberRepository(supabaseService);
const memberService = new MemberService(memberRepository);
const membersController = new MembersController(memberService);
const memberRouter = createMembersRouter({
  membersController,
  memberRepository,
  memberService,
  supabaseService,
});

// Check-in
const checkInRepository = new CheckInRepository(supabaseService);
const checkInService = new CheckInService(checkInRepository, memberRepository);
const checkInsController = new CheckInsController(checkInService);
const checkInRouter = createCheckInsRouter({
  checkInsController,
  checkInRepository,
  checkInService,
  memberRepository,
  supabaseService,
});

// Membership Plan
const membershipPlansRepository = new MembershipPlanRepository(supabaseService);
const membershipPlansService = new MembershipPlanService(
  membershipPlansRepository,
);
const membershipPlansController = new MembershipPlansController(
  membershipPlansService,
);
const membershipPlanRouter = createMembershipPlansRouter({
  supabaseService,
  membershipPlansRepository,
  membershipPlansService,
  membershipPlansController,
});

// Payment
const paymentRepository = new PaymentRepository(supabaseService);
const stripeService = new StripeService();
const paymentService = new PaymentService(
  memberRepository,
  paymentRepository,
  membershipPlansRepository,
  stripeService,
);
const paymentsController = new PaymentsController(paymentService);
const paymentRouter = createPaymentsRouter({
  memberRepository,
  membershipPlansRepository,
  paymentRepository,
  paymentService,
  paymentsController,
  stripeService,
  supabaseService,
});

// Set up routes
const apiRouter = express.Router();
apiRouter.use('/check-ins', checkInRouter);
apiRouter.use('/members', memberRouter);
apiRouter.use('/membership-plans', membershipPlanRouter);
apiRouter.use('/payments', paymentRouter);
app.use('/api', apiRouter);

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log('Error caught in global error handler');
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
