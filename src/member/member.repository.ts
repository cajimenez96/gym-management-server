import type {
	CreateMemberDto,
	DbMember,
	Member,
	UpdateMemberDto,
} from '@/member';
import type { Enums, SupabaseService } from '@/supabase';
import { camelToSnakeCase, transformSupabaseResultToCamelCase } from '@/utils';

export class MemberRepository {
	private readonly tableName = 'member';
	private readonly selectFields =
		'id, first_name, last_name, dni, email, phone, start_date, renewal_date, membership_status, membership_plan, status, created_at, updated_at';

	constructor(private readonly supabaseService: SupabaseService) {}

	private get supabase() {
		return this.supabaseService.getClient().from(this.tableName);
	}

	async create(createMemberDto: CreateMemberDto): Promise<Member> {
		const snakeCaseDto = camelToSnakeCase(createMemberDto) as any;
		const { data, error } = await (this.supabase as any)
			.insert([snakeCaseDto])
			.select(this.selectFields)
			.single();

		if (error) {
			this.handleError(error, 'create member');
		}

		return transformSupabaseResultToCamelCase<Member>(data);
	}

	async findAll(): Promise<Member[]> {
		const { data, error } = await this.supabase.select(this.selectFields);

		if (error) {
			this.handleError(error, 'retrieve members');
		}

		return transformSupabaseResultToCamelCase<Member[]>(data);
	}

	async findById(id: string): Promise<Member> {
		const { data, error } = await this.supabase
			.select(this.selectFields)
			.eq('id', id)
			.single();

		if (error) {
			this.handleError(error, 'retrieve member');
		}

		if (!data) {
			throw new Error(`Member with ID ${id} not found`);
		}

		return transformSupabaseResultToCamelCase<Member>(data);
	}

	async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
		const snakeCaseDto = camelToSnakeCase(updateMemberDto);
		const { data, error } = await this.supabase
			.update(snakeCaseDto)
			.eq('id', id)
			.select(this.selectFields)
			.single();

		if (error) {
			this.handleError(error, 'update member');
		}

		if (!data) {
			throw new Error(`Member with ID ${id} not found`);
		}

		return transformSupabaseResultToCamelCase<Member>(data);
	}

	async remove(id: string): Promise<Member> {
		const { data, error } = await this.supabase
			.delete()
			.eq('id', id)
			.select(this.selectFields)
			.single();

		if (error) {
			this.handleError(error, 'delete member');
		}

		if (!data) {
			throw new Error(`Member with ID ${id} not found`);
		}

		return transformSupabaseResultToCamelCase<Member>(data);
	}

	async updateMemberStatus(
		memberId: string,
		status: Enums<'member_status'>,
	): Promise<void> {
		const { error } = await this.supabase.update({ status }).eq('id', memberId);

		if (error) {
			this.handleError(error, 'update member status');
		}
	}

	async findByEmail(email: string): Promise<Member | null> {
		const { data } = await this.supabase
			.select(this.selectFields)
			.eq('email', email)
			.single();

		return data ? transformSupabaseResultToCamelCase<Member>(data) : null;
	}

	async findByDni(dni: string): Promise<Member | null> {
		const { data } = await this.supabase
			.select(this.selectFields)
			.eq('dni', dni)
			.single();

		return data ? transformSupabaseResultToCamelCase<Member>(data) : null;
	}

	async renewMembership(dni: string, fechaRenovacion: string, plan?: string): Promise<Member> {
		const updateData: any = {
			renewal_date: fechaRenovacion,
			membership_status: 'active', // Reset status when renewing
		};

		if (plan) {
			updateData.membership_plan = plan;
		}

		const { data, error } = await (this.supabase as any)
			.update(updateData)
			.eq('dni', dni)
			.select(this.selectFields)
			.single();

		if (error) {
			this.handleError(error, 'renew membership');
		}

		if (!data) {
			throw new Error(`Member with DNI ${dni} not found`);
		}

		return transformSupabaseResultToCamelCase<Member>(data);
	}

	async updateEstadoByFechaRenovacion(): Promise<void> {
		// Update members' membership_status based on renewal_date
		const now = new Date().toISOString();
		
		// Set membership_status to 'expired' for expired members
		const { error } = await (this.supabase as any)
			.update({ membership_status: 'expired' })
			.lt('renewal_date', now)
			.neq('membership_status', 'expired');

		if (error) {
			this.handleError(error, 'update member status based on expiration date');
		}
	}

	private handleError(error: any, operation: string): never {
		if (error?.code === 'PGRST116') {
			throw new Error(`Member not found for ${operation}`);
		}

		throw new Error(`Failed to ${operation}: ${error.message}`);
	}
}
