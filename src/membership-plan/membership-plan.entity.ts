export interface DbMembershipPlan {
	id: string;
	name: string;
	duration: string;
	price: number;
	created_at: string;
	updated_at: string;
}

export type MembershipDuration = 'daily' | 'weekly' | 'monthly';

export interface MembershipPlan {
	id: string;

	name: string;

	duration: MembershipDuration; // Can be 'daily', 'weekly', or 'monthly'

	price: number; // Decimal

	createdAt: string;

	updatedAt: string;
}
