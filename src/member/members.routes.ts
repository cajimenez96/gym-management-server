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
	router.post('/', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res, next) => {
		try {
			const result = await membersController.create(req.body);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	});

	// READ - Owner y Admin (admin necesita ver miembros para check-ins)
	router.get('/', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res, next) => {
		try {
			const result = await membersController.findAll();
			res.json(result);
		} catch (error) {
			next(error);
		}
	});

	// GET CHECK-IN INFO BY DNI - Cualquier rol autenticado (para el popup informativo)
	router.get('/check-in-info/:dni', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res, next) => {
		try {
			const { dni } = req.params;
			const result = await membersController.getCheckInInfoByDni(dni);
			res.json(result);
		} catch (error) {
			// El servicio ya lanza un error con status 404 si no se encuentra, 
			// el middleware de errores global debería manejarlo.
			next(error);
		}
	});

	// SEARCH BY DNI - Owner y Admin (admin necesita buscar para check-ins)
	router.get('/dni/:dni', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res, next) => {
		try {
			const result = await membersController.findByDni(req.params.dni);
			if (!result) {
				// Es importante devolver 404 aquí si la ruta es específica para encontrar uno y no lo hace
				return res.status(404).json({ message: 'Member not found' });
			}
			res.json(result);
		} catch (error) {
			next(error);
		}
	});

	// GET ACTIVE MEMBERS - Owner y Admin
	router.get('/active', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res, next) => {
		try{
			const result = await membersController.getActiveMembers();
			res.json(result);
		} catch (error) {
			next(error);
		}
	});

	// GET EXPIRED MEMBERS - Solo Owner (para estadísticas)
	router.get('/expired', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res, next) => {
		try {
			const result = await membersController.getExpiredMembers();
			res.json(result);
		} catch (error) {
			next(error);
		}
	});

	// UPDATE MEMBER STATUSES - Solo Owner (mantenimiento)
	router.post('/update-statuses', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res, next) => {
		try {
			await membersController.updateMemberStatuses();
			res.json({ message: 'Member statuses updated successfully' });
		} catch (error) {
			next(error);
		}
	});

	// GET BY ID - Owner y Admin
	router.get('/:id', authMiddleware.authenticateToken, authMiddleware.requireAnyRole, async (req, res, next) => {
		try {
			const result = await membersController.findById(req.params.id);
			res.json(result);
		} catch (error) {
			// Asumiendo que findById también lanza error si no se encuentra, y el middleware de errores lo maneja.
			next(error);
		}
	});

	// UPDATE - Solo owner
	router.patch('/:id', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res, next) => {
		try {
			const result = await membersController.update(req.params.id, req.body);
			res.json(result);
		} catch (error) {
			next(error);
		}
	});

	// RENEW MEMBERSHIP BY DNI - Solo Owner (business critical)
	router.patch('/:dni/renew', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res, next) => {
		try {
			const renewDto = {
				dni: req.params.dni,
				...req.body
			};
			const result = await membersController.renewMembership(renewDto);
			res.json(result);
		} catch (error) {
			next(error);
		}
	});

	// DELETE - Solo owner
	router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.requireOwnerOnly, async (req, res, next) => {
		try {
			const result = await membersController.remove(req.params.id);
			res.json(result);
		} catch (error) {
			next(error);
		}
	});

	return router;
};
