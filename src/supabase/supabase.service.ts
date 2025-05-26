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
			console.log('🔄 Verificando conexión a Supabase...');
			console.log('📍 URL:', config.supabase.url);
			console.log('🔑 Key:', config.supabase.key ? '***' + config.supabase.key.slice(-4) : 'NO CONFIGURADA');
			
			// Verificar conectividad básica usando auth
			const { data, error } = await this.supabase.auth.getSession();

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
				await this.createDatabaseSchema();
			} else {
				console.log('✅ Todas las tablas principales existen y están listas!');
			}
		} catch (error) {
			console.log('⚠️  Error verificando esquema:', error);
		}
	}

	private async createDatabaseSchema(): Promise<void> {
		const createTablesSQL = `
		-- Crear tablas para el sistema de gestión de gimnasio
		
		-- Tabla members
		CREATE TABLE IF NOT EXISTS member (
			id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
			first_name VARCHAR(100) NOT NULL,
			last_name VARCHAR(100) NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			phone VARCHAR(20),
			status VARCHAR(20) DEFAULT 'Active',
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		);

		-- Tabla membership_plan
		CREATE TABLE IF NOT EXISTS membership_plan (
			id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			duration INTEGER NOT NULL,
			price DECIMAL(10,2) NOT NULL,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		);

		-- Tabla payment
		CREATE TABLE IF NOT EXISTS payment (
			id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
			member_id UUID REFERENCES member(id),
			plan_id UUID REFERENCES membership_plan(id),
			amount DECIMAL(10,2) NOT NULL,
			date TIMESTAMP DEFAULT NOW(),
			status VARCHAR(20) DEFAULT 'Pending',
			stripe_payment_intent_id VARCHAR(100) NULL,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		);

		-- Tabla check_in
		CREATE TABLE IF NOT EXISTS check_in (
			id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
			member_id UUID REFERENCES member(id),
			date_time TIMESTAMP DEFAULT NOW(),
			created_at TIMESTAMP DEFAULT NOW()
		);

		-- Tabla membership
		CREATE TABLE IF NOT EXISTS membership (
			id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
			member_id UUID REFERENCES member(id),
			plan_id UUID REFERENCES membership_plan(id),
			start_date TIMESTAMP NOT NULL,
			end_date TIMESTAMP NOT NULL,
			status VARCHAR(20) DEFAULT 'Active',
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		);

		-- Crear tipos enum para status
		DO $$ 
		BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
				CREATE TYPE payment_status AS ENUM ('Pending', 'Successful', 'Failed');
			END IF;
		END $$;
		`;

		// Para seguridad, mostrar el SQL para ejecución manual
		console.log('💡 Para crear las tablas automáticamente, necesitas ejecutar SQL manualmente');
		await this.createTablesAlternative();
	}

	private async createTablesAlternative(): Promise<void> {
		console.log('🔄 Intentando método alternativo para crear tablas...');
		console.log('');
		console.log('📋 COPIA Y PEGA EL SIGUIENTE SQL EN SUPABASE DASHBOARD:');
		console.log('─'.repeat(60));
		console.log(`
-- Tabla members
CREATE TABLE IF NOT EXISTS member (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla membership_plan
CREATE TABLE IF NOT EXISTS membership_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla payment
CREATE TABLE IF NOT EXISTS payment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES member(id),
    plan_id UUID REFERENCES membership_plan(id),
    amount DECIMAL(10,2) NOT NULL,
    date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'Pending',
    stripe_payment_intent_id VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla check_in
CREATE TABLE IF NOT EXISTS check_in (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES member(id),
    date_time TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla membership
CREATE TABLE IF NOT EXISTS membership (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES member(id),
    plan_id UUID REFERENCES membership_plan(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla users (Sistema de autenticación)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
		`);
		console.log('─'.repeat(60));
		console.log('💡 Ve a tu Supabase Dashboard > SQL Editor > New Query');
		console.log('💡 Pega el SQL de arriba y ejecuta');
		console.log('💡 Luego reinicia el servidor con: bun run dev');
	}
}
