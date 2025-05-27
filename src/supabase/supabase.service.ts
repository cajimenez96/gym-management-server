import { config } from '@/config';
import { type SupabaseClient, createClient } from '@supabase/supabase-js';
import type { Database } from './supabase';

export class SupabaseService {
	private readonly supabase: SupabaseClient<Database>;

	constructor() {
		this.supabase = createClient(
			config.supabase.url!,
			config.supabase.key!,
		);
	}

	getClient(): SupabaseClient<Database> {
		return this.supabase;
	}

	async testConnection(): Promise<boolean> {
		try {
			// Verificar conectividad básica usando auth
			const { error } = await this.supabase.auth.getSession();

			if (error && error.message.includes('Invalid')) {
				console.error('❌ Error: Credenciales inválidas');
				console.log('💡 Verifica tus credenciales en el archivo .env');
				return false;
			}

			console.log('✅ Conexión a Supabase exitosa!');
			
			// Verificar y crear tablas automáticamente
			await this.initializeDatabase();
			
			return true;
		} catch (error) {
			console.error('❌ Error verificando conexión a Supabase:', error);
			console.log('💡 Verifica que tu URL y Key de Supabase sean correctas');
			return false;
		}
	}

	async initializeDatabase(): Promise<void> {
		console.log('🔍 Verificando esquema de base de datos...');
		
		try {
			// Verificar si las tablas principales existen
			const { error: memberError } = await this.supabase
				.from('member')
				.select('id')
				.limit(1);

			const { error: usersError } = await this.supabase
				.from('users' as any)
				.select('id')
				.limit(1);

			// Solo mostrar el mensaje si alguna tabla no existe
			if ((memberError && memberError.message.includes('does not exist')) ||
				(usersError && usersError.message.includes('does not exist'))) {
				console.log('📋 Algunas tablas no encontradas. Mostrando SQL para crear...');
			} else {
				console.log('✅ Todas las tablas principales existen y están listas!');
			}
		} catch (error) {
			console.log('⚠️  Error verificando esquema:', error);
		}
	}
}
