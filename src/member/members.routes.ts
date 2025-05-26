import type {
	CreateMemberDto,
	MemberRepository,
	MemberService,
	MembersController,
	UpdateMemberDto,
} from '@/member';
import type { SupabaseService } from '@/supabase';
import { authMiddleware } from '@/auth';
import { Router } from 'express';

interface MemberRouterDependencies {
	supabaseService: SupabaseService;
	memberRepository: MemberRepository;
	memberService: MemberService;
	membersController: MembersController;
}

export const createMembersRouter = ({
	membersController,
}: MemberRouterDependencies): Router => {
	const router = Router();

	// CREATE - Solo owner
	router.post('/', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await membersController.create(req.body);
		res.status(201).json(result);
	});

	// READ - Owner y Admin (admin necesita ver miembros para check-ins)
	router.get('/', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res) => {
		const result = await membersController.findAll();
		res.json(result);
	});

	// UPDATE - Solo owner
	router.patch('/:id', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await membersController.update(req.params.id, req.body);
		res.json(result);
	});

	// DELETE - Solo owner
	router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await membersController.remove(req.params.id);
		res.json(result);
	});

	return router;
};
