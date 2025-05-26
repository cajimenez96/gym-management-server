import type {
	CheckInRepository,
	CheckInService,
	CheckInsController,
} from '@/check-in';
import type { MemberRepository } from '@/member';
import type { SupabaseService } from '@/supabase';
import { authMiddleware } from '@/auth';
import { Router } from 'express';

interface CheckInRouterDependencies {
	supabaseService: SupabaseService;
	checkInRepository: CheckInRepository;
	memberRepository: MemberRepository;
	checkInService: CheckInService;
	checkInsController: CheckInsController;
}

export const createCheckInsRouter = ({
	checkInsController,
}: CheckInRouterDependencies): Router => {
	const router = Router();

	// CREATE CHECK-IN - Owner y Admin (funcionalidad principal de admin)
	router.post('/', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res) => {
		const result = await checkInsController.createCheckIn(req.body.memberId);
		res.status(201).json(result);
	});

	// GET CHECK-INS - Owner y Admin
	router.get('/', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res) => {
		const result = await checkInsController.getHistoricalCheckIns();
		res.json(result);
	});

	return router;
};
