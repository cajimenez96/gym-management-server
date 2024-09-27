export interface DbMembershipPlan {
	id: string;
	name: string;
	duration: number;
	price: number;
	created_at: string;
	updated_at: string;
}

export interface MembershipPlan {
	id: string;

	name: string;

	duration: number; // In months

	price: number; // Decimal

	createdAt: string;

	updatedAt: string;
}
