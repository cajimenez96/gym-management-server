import type { CreateUserDto, DbUser } from '@/auth';
import type { SupabaseService } from '@/supabase';
import { camelToSnakeCase, transformSupabaseResultToCamelCase } from '@/utils';

export class AuthRepository {
	private readonly tableName = 'users';
	private readonly selectFields = 'id, username, password_hash, role, created_at, updated_at';
	private readonly publicSelectFields = 'id, username, role, created_at, updated_at';

	constructor(private readonly supabaseService: SupabaseService) {}

	private get supabase() {
		// Bypass TypeScript para tabla users que no está en los tipos generados
		return this.supabaseService.getClient().from(this.tableName as any);
	}

	async createUser(createUserDto: CreateUserDto & { password_hash?: string }): Promise<DbUser> {
		// Crear objeto con el formato correcto para la DB
		const dbRecord = {
			username: createUserDto.username,
			password_hash: createUserDto.password_hash || (createUserDto as any).password_hash,
			role: createUserDto.role,
		};

		const { data, error } = await this.supabase
			.insert([dbRecord])
			.select(this.selectFields)
			.single();

		if (error) {
			this.handleError(error, 'create user');
		}

		return transformSupabaseResultToCamelCase<DbUser>(data);
	}

	async findByUsername(username: string): Promise<DbUser | null> {
		const { data, error } = await this.supabase
			.select(this.selectFields)
			.eq('username', username)
			.single();

		if (error) {
			// Si no encuentra el usuario, no es un error fatal
			if (error.code === 'PGRST116') {
				return null;
			}
			this.handleError(error, 'find user by username');
		}

		return data ? transformSupabaseResultToCamelCase<DbUser>(data) : null;
	}

	async findById(id: string): Promise<DbUser | null> {
		const { data, error } = await this.supabase
			.select(this.publicSelectFields)
			.eq('id', id)
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				return null;
			}
			this.handleError(error, 'find user by id');
		}

		return data ? transformSupabaseResultToCamelCase<DbUser>(data) : null;
	}

	async findAllUsers(): Promise<DbUser[]> {
		const { data, error } = await this.supabase
			.select(this.publicSelectFields);

		if (error) {
			this.handleError(error, 'retrieve all users');
		}

		return transformSupabaseResultToCamelCase<DbUser[]>(data || []);
	}

	private handleError(error: any, operation: string): never {
		if (error?.code === 'PGRST116') {
			throw new Error(`User not found for ${operation}`);
		}

		if (error?.code === '23505') {
			throw new Error('Username already exists');
		}

		throw new Error(`Failed to ${operation}: ${error.message}`);
	}
} 