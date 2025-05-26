import type {
	AuthService,
	CreateUserDto,
	LoginRequestDto,
	LoginResponseDto,
	LogoutResponseDto,
	UserPublic,
} from '@/auth';

export class AuthController {
	constructor(private readonly authService: AuthService) {}

	async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
		return this.authService.login(loginDto);
	}

	async createUser(createUserDto: CreateUserDto): Promise<UserPublic> {
		return this.authService.createUser(createUserDto);
	}

	async logout(): Promise<LogoutResponseDto> {
		// Para JWT, el logout se maneja en el cliente eliminando el token
		// En el servidor podemos simplemente retornar un mensaje de confirmación
		return {
			message: 'Logout successful',
		};
	}

	async verifyToken(token: string) {
		return this.authService.verifyToken(token);
	}

	async getCurrentUser(userId: string): Promise<UserPublic | null> {
		return this.authService.getUserById(userId);
	}
} 