import type {
	CreateMembershipPlanDto,
	MembershipPlanRepository,
	MembershipPlanService,
	MembershipPlansController,
	UpdateMembershipPlanDto,
} from '@/membership-plan';
import type { SupabaseService } from '@/supabase';
import { authMiddleware } from '@/auth';
import { Router } from 'express';

interface MembershipPlanRouterDependencies {
	supabaseService: SupabaseService;
	membershipPlansRepository: MembershipPlanRepository;
	membershipPlansService: MembershipPlanService;
	membershipPlansController: MembershipPlansController;
}

export const createMembershipPlansRouter = ({
	membershipPlansController,
}: MembershipPlanRouterDependencies): Router => {
	const router = Router();

	// CREATE - Solo owner
	router.post('/', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await membershipPlansController.create(req.body);
		res.status(201).json(result);
	});

	// READ ALL - Owner y Admin (admin necesita ver planes disponibles)
	router.get('/', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res) => {
		const result = await membershipPlansController.findAll();
		res.json(result);
	});

	// READ ONE - Owner y Admin
	router.get('/:id', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res) => {
		const result = await membershipPlansController.findOne(req.params.id);
		res.json(result);
	});

	// UPDATE - Solo owner
	router.patch('/:id', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await membershipPlansController.update(req.params.id, req.body);
		res.json(result);
	});

	// DELETE - Solo owner
	router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await membershipPlansController.remove(req.params.id);
		res.json(result);
	});

	return router;
};
