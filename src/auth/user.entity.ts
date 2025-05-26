export interface User {
	id: string;
	username: string;
	role: 'owner' | 'admin';
	created_at: string;
	updated_at: string;
}

export interface DbUser {
	id: string;
	username: string;
	password_hash: string;
	role: 'owner' | 'admin';
	created_at: string;
	updated_at: string;
}

export interface UserPublic {
	id: string;
	username: string;
	role: 'owner' | 'admin';
}

export interface AuthTokenPayload {
	userId: string;
	username: string;
	role: 'owner' | 'admin';
} 