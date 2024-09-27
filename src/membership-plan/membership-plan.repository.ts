import type {
	CreateMembershipPlanDto,
	DbMembershipPlan,
	MembershipPlan,
	UpdateMembershipPlanDto,
} from '@/membership-plan';
import type { SupabaseService } from '@/supabase';
import { camelToSnakeCase, transformSupabaseResultToCamelCase } from '@/utils';

export class MembershipPlanRepository {
	private readonly tableName = 'membership_plan';
	private readonly selectFields =
		'id, name, duration, price, created_at, updated_at';

	constructor(private readonly supabaseService: SupabaseService) {}

	private get db() {
		return this.supabaseService.getClient().from(this.tableName);
	}

	async create(
		createMembershipPlanDto: CreateMembershipPlanDto,
	): Promise<MembershipPlan> {
		const snakeCaseDto = camelToSnakeCase(
			createMembershipPlanDto,
		) as DbMembershipPlan;
		const { data, error } = await this.db
			.insert([snakeCaseDto])
			.select(this.selectFields)
			.single();

		if (error) {
			this.handleError(error, 'create membership plan');
		}

		return transformSupabaseResultToCamelCase<MembershipPlan>(data);
	}

	async findAll(): Promise<MembershipPlan[]> {
		const { data, error } = await this.db.select(this.selectFields);

		if (error) {
			this.handleError(error, 'retrieve membership plans');
		}

		return transformSupabaseResultToCamelCase<MembershipPlan[]>(data);
	}

	async findOne(id: string): Promise<MembershipPlan> {
		const { data, error } = await this.db
			.select(this.selectFields)
			.eq('id', id)
			.single();

		if (error) {
			this.handleError(error, 'retrieve membership plan');
		}

		return transformSupabaseResultToCamelCase<MembershipPlan>(data);
	}

	async update(
		id: string,
		updateMembershipPlanDto: UpdateMembershipPlanDto,
	): Promise<MembershipPlan> {
		const snakeCaseDto = camelToSnakeCase(updateMembershipPlanDto);
		const { data, error } = await this.db
			.update(snakeCaseDto)
			.eq('id', id)
			.select(this.selectFields)
			.single();

		if (error) {
			this.handleError(error, 'update membership plan');
		}

		if (!data) {
			throw new Error(`Membership plan with ID ${id} not found`);
		}

		return transformSupabaseResultToCamelCase<MembershipPlan>(data);
	}

	async remove(id: string): Promise<MembershipPlan> {
		const client = this.supabaseService.getClient();

		// First, delete associated memberships
		const { error: membershipDeleteError } = await client
			.from('membership')
			.delete()
			.eq('plan_id', id);

		if (membershipDeleteError) {
			this.handleError(membershipDeleteError, 'delete associated memberships');
		}

		// Then, delete the membership plan
		const { data, error } = await this.db
			.delete()
			.eq('id', id)
			.select(this.selectFields)
			.single();

		if (error) {
			this.handleError(error, 'delete membership plan');
		}

		if (!data) {
			throw new Error(`Membership plan with ID ${id} not found`);
		}

		return transformSupabaseResultToCamelCase<MembershipPlan>(data);
	}

	async findByName(name: string): Promise<MembershipPlan | null> {
		const { data, error } = await this.db
			.select(this.selectFields)
			.eq('name', name);

		if (error) {
			this.handleError(error, 'find membership plan by name');
		}

		return data && data.length > 0
			? transformSupabaseResultToCamelCase<MembershipPlan>(data[0])
			: null;
	}

	private handleError(error: any, operation: string): never {
		if (error?.code === 'PGRST116') {
			throw new Error(`Membership plan not found for ${operation}`);
		}

		throw new Error(`Failed to ${operation}: ${error.message}`);
	}
}
