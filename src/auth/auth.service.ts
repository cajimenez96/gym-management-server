import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { 
	AuthRepository, 
	CreateUserDto, 
	LoginRequestDto, 
	LoginResponseDto, 
	AuthTokenPayload,
	UserPublic 
} from '@/auth';

export class AuthService {
	private readonly JWT_SECRET = process.env.JWT_SECRET || 'gym-management-secret-key';
	private readonly JWT_EXPIRES_IN = '24h';
	private readonly SALT_ROUNDS = 12;

	constructor(private readonly authRepository: AuthRepository) {}

	async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
		const { username, password } = loginDto;

		// Buscar usuario por username
		const user = await this.authRepository.findByUsername(username);
		if (!user) {
			throw new Error('Invalid username or password');
		}

		// Verificar contraseña - usar passwordHash (camelCase) en lugar de password_hash
		const passwordHash = (user as any).passwordHash || user.password_hash;
		const isPasswordValid = await bcrypt.compare(password, passwordHash);
		if (!isPasswordValid) {
			throw new Error('Invalid username or password');
		}

		// Generar JWT token
		const tokenPayload: AuthTokenPayload = {
			userId: user.id,
			username: user.username,
			role: user.role,
		};

		const token = jwt.sign(tokenPayload, this.JWT_SECRET, {
			expiresIn: this.JWT_EXPIRES_IN,
		});

		return {
			user: {
				id: user.id,
				username: user.username,
				role: user.role,
			},
			token,
			message: 'Login successful',
		};
	}

	async createUser(createUserDto: CreateUserDto): Promise<UserPublic> {
		const { username, password, role } = createUserDto;

		// Verificar si el usuario ya existe
		const existingUser = await this.authRepository.findByUsername(username);
		if (existingUser) {
			throw new Error('Username already exists');
		}

		// Hash de la contraseña
		const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

		// Crear usuario en la base de datos
		const newUser = await this.authRepository.createUser({
			username,
			password_hash: passwordHash,
			role,
		} as any);

		return {
			id: newUser.id,
			username: newUser.username,
			role: newUser.role,
		};
	}

	async verifyToken(token: string): Promise<AuthTokenPayload> {
		try {
			const decoded = jwt.verify(token, this.JWT_SECRET) as AuthTokenPayload;
			return decoded;
		} catch (error) {
			throw new Error('Invalid or expired token');
		}
	}

	async getUserById(userId: string): Promise<UserPublic | null> {
		const user = await this.authRepository.findById(userId);
		if (!user) {
			return null;
		}

		return {
			id: user.id,
			username: user.username,
			role: user.role,
		};
	}

	generateToken(payload: AuthTokenPayload): string {
		return jwt.sign(payload, this.JWT_SECRET, {
			expiresIn: this.JWT_EXPIRES_IN,
		});
	}
} 