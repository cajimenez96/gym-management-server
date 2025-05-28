import type {
	AuthController,
	AuthRepository,
	AuthService,
	CreateUserDto,
	LoginRequestDto,
} from '@/auth';
import type { SupabaseService } from '@/supabase';
import { Router } from 'express';
import { authMiddleware } from './auth.middleware';

interface AuthRouterDependencies {
	supabaseService: SupabaseService;
	authRepository: AuthRepository;
	authService: AuthService;
	authController: AuthController;
}

export const createAuthRouter = ({
	authController,
}: AuthRouterDependencies): Router => {
	const router = Router();

	// POST /auth/login - Autenticar usuario
	router.post<unknown, unknown, LoginRequestDto>('/login', async (req, res) => {
		try {
			const result = await authController.login(req.body);
			res.json(result);
		} catch (error) {
			res.status(401).json({
				error: 'Authentication failed',
				message: error instanceof Error ? error.message : 'Invalid credentials',
			});
		}
	});

	// POST /auth/logout - Cerrar sesión
	router.post('/logout', async (req, res) => {
		const result = await authController.logout();
		res.json(result);
	});

	// POST /auth/register - Crear nuevo usuario (solo para testing/setup)
	router.post<unknown, unknown, CreateUserDto>('/register', async (req, res) => {
		try {
			const result = await authController.createUser(req.body);
			res.status(201).json(result);
		} catch (error) {
			res.status(400).json({
				error: 'User creation failed',
				message: error instanceof Error ? error.message : 'Could not create user',
			});
		}
	});

	// GET /auth/me - Obtener información del usuario actual
	router.get(
		'/me', 
		authMiddleware.authenticateToken,
		async (req, res) => {
			try {
				const userId = req.user?.userId;
				if (!userId) {
					return res.status(401).json({
						error: 'Unauthorized',
						message: 'User ID not found in token payload after authentication',
					});
				}

				const result = await authController.getCurrentUser(userId);
				if (!result) {
					return res.status(404).json({
						error: 'User not found',
						message: 'User no longer exists',
					});
				}

				res.json(result);
			} catch (error) {
				res.status(500).json({
					error: 'Internal server error',
					message: error instanceof Error ? error.message : 'Unknown error',
				});
			}
		}
	);

	return router;
}; 