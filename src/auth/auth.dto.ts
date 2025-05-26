export interface LoginRequestDto {
	username: string;
	password: string;
}

export interface LoginResponseDto {
	user: {
		id: string;
		username: string;
		role: 'owner' | 'admin';
	};
	token: string;
	message: string;
}

export interface CreateUserDto {
	username: string;
	password: string;
	role: 'owner' | 'admin';
}

export interface AuthErrorDto {
	error: string;
	message: string;
}

export interface LogoutResponseDto {
	message: string;
} 