import {
	AuthRepository,
	AuthService,
	AuthController,
	createAuthRouter,
} from '@/auth';
import {
	CheckInRepository,
	CheckInService,
	CheckInsController,
	createCheckInsRouter,
} from '@/check-in';
import {
	MemberRepository,
	MemberService,
	MembersController,
	createMembersRouter,
} from '@/member';
import {
	MembershipPlanRepository,
	MembershipPlanService,
	MembershipPlansController,
	createMembershipPlansRouter,
} from '@/membership-plan';
import {
	PaymentRepository,
	PaymentService,
	PaymentsController,
	createPaymentsRouter,
} from '@/payment';
import { SupabaseService } from '@/supabase';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 4000;

// Set up middleware
app.use(bodyParser.json()); // Parses incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
app.use(
	cors(),
);

// Set up dependencies
const supabaseService = new SupabaseService();

// Auth
const authRepository = new AuthRepository(supabaseService);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authRouter = createAuthRouter({
	authController,
	authRepository,
	authService,
	supabaseService,
});

// Member
const memberRepository = new MemberRepository(supabaseService);
const membershipPlansRepository = new MembershipPlanRepository(supabaseService);
const memberService = new MemberService(memberRepository, membershipPlansRepository);
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
const paymentService = new PaymentService(
	memberRepository,
	paymentRepository,
	membershipPlansRepository,
);
const paymentsController = new PaymentsController(paymentService);
const paymentRouter = createPaymentsRouter({
	memberRepository,
	membershipPlansRepository,
	paymentRepository,
	paymentService,
	paymentsController,
	supabaseService,
});

// Set up routes
const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/check-ins', checkInRouter);
apiRouter.use('/members', memberRouter);
apiRouter.use('/membership-plans', membershipPlanRouter);
apiRouter.use('/payments', paymentRouter);
app.use('/api', apiRouter);

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
	console.log('Error caught in global error handler:');
	console.error('Original Error Message:', err.message);
	console.error('Original Error Status:', err.status);
	// console.error(err.stack); // Puede ser muy verboso, opcional para producción

	const statusCode = err.status || 500;
	// Si el statusCode es un error del cliente (4xx), usa su mensaje.
	// Sino, para 5xx no esperados, un mensaje genérico es más seguro.
	const responseMessage = (statusCode >= 400 && statusCode < 500) ? err.message : 'Ocurrió un error inesperado en el servidor.';

	res.status(statusCode).json({
		status: 'error',
		message: responseMessage,
		// Proporcionar más detalles solo en modo de desarrollo por seguridad
		...(process.env.NODE_ENV === 'development' && { 
            errorDetails: err.message, // Mantenemos el mensaje original del error para depuración en dev
            isCustomStatus: !!err.status, 
            // stack: err.stack // Descomentar si se necesita el stack trace completo en dev
        }),
	});
});

// Start the server
app.listen(port, async () => {
	console.log(`🚀 Server is running on port ${port}`);
	
	// Test database connection
	await supabaseService.testConnection();
});
