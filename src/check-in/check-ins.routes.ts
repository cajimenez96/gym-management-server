import type {
	CheckInRepository,
	CheckInService,
	CheckInsController,
} from '@/check-in';
import type { MemberRepository } from '@/member';
import type { SupabaseService } from '@/supabase';
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

	router.post<unknown, unknown, { memberId: string }>('/', async (req, res) => {
		const result = await checkInsController.createCheckIn(req.body.memberId);
		res.status(201).json(result);
	});

	router.get('/', async (req, res) => {
		const result = await checkInsController.getHistoricalCheckIns();
		res.json(result);
	});

	return router;
};
