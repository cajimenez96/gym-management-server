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

	// SEARCH BY DNI - Owner y Admin (admin necesita buscar para check-ins)
	router.get('/dni/:dni', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res) => {
		const result = await membersController.findByDni(req.params.dni);
		if (!result) {
			return res.status(404).json({ message: 'Member not found' });
		}
		res.json(result);
	});

	// GET ACTIVE MEMBERS - Owner y Admin
	router.get('/active', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res) => {
		const result = await membersController.getActiveMembers();
		res.json(result);
	});

	// GET EXPIRED MEMBERS - Solo Owner (para estadísticas)
	router.get('/expired', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await membersController.getExpiredMembers();
		res.json(result);
	});

	// UPDATE MEMBER STATUSES - Solo Owner (mantenimiento)
	router.post('/update-statuses', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		await membersController.updateMemberStatuses();
		res.json({ message: 'Member statuses updated successfully' });
	});

	// GET BY ID - Owner y Admin
	router.get('/:id', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res) => {
		const result = await membersController.findById(req.params.id);
		res.json(result);
	});

	// UPDATE - Solo owner
	router.patch('/:id', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await membersController.update(req.params.id, req.body);
		res.json(result);
	});

	// RENEW MEMBERSHIP BY DNI - Solo Owner (business critical)
	router.patch('/:dni/renew', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const renewDto = {
			dni: req.params.dni,
			...req.body
		};
		const result = await membersController.renewMembership(renewDto);
		res.json(result);
	});

	// DELETE - Solo owner
	router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res) => {
		const result = await membersController.remove(req.params.id);
		res.json(result);
	});

	return router;
};
