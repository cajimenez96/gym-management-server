import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthTokenPayload } from '@/auth';

// Extend Request type to include user information
declare global {
	namespace Express {
		interface Request {
			user?: AuthTokenPayload;
		}
	}
}

export class AuthMiddleware {
	private readonly JWT_SECRET = process.env.JWT_SECRET || 'gym-management-secret-key';

	// Middleware para verificar JWT token
	authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

		if (!token) {
			res.status(401).json({
				error: 'Unauthorized',
				message: 'Access token is required',
			});
			return;
		}

		try {
			const decoded = jwt.verify(token, this.JWT_SECRET) as AuthTokenPayload;
			req.user = decoded;
			next();
		} catch (error: any) {
			res.status(403).json({
				error: 'Forbidden',
				message: 'Invalid or expired token',
			});
		}
	};

	// Middleware para verificar roles específicos
	requireRole = (allowedRoles: Array<'owner' | 'admin'>) => {
		return (req: Request, res: Response, next: NextFunction): void => {
			if (!req.user) {
				res.status(401).json({
					error: 'Unauthorized',
					message: 'Authentication required',
				});
				return;
			}

			if (!allowedRoles.includes(req.user.role)) {
				res.status(403).json({
					error: 'Forbidden',
					message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
				});
				return;
			}

			next();
		};
	};

	// Middleware específico para owner (acceso completo)
	requireOwner = this.requireRole(['owner']);

	// Middleware específico para admin (solo check-ins)
	requireAdmin = this.requireRole(['admin']);

	// Middleware para owner o admin (cualquier usuario autenticado)
	requireAnyRole = this.requireRole(['owner', 'admin']);

	// Middleware para operaciones que solo puede hacer owner
	requireOwnerOnly = (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({
				error: 'Unauthorized',
				message: 'Authentication required',
			});
			return;
		}

		if (req.user.role !== 'owner') {
			res.status(403).json({
				error: 'Forbidden', 
				message: 'Owner access required for this operation',
			});
			return;
		}

		next();
	};
}

// Instancia global del middleware
export const authMiddleware = new AuthMiddleware(); 