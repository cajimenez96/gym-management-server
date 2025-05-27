export enum MemberStatus {
	Active = 'Active',
	Inactive = 'Inactive',
	Suspended = 'Suspended',
}

export enum MembershipStatus {
	Active = 'active',
	Expired = 'expired',
}

export interface DbMember {
	id: string;
	first_name: string;
	last_name: string;
	dni: string;
	email?: string;
	phone?: string;
	start_date: string;
	renewal_date: string;
	membership_status: MembershipStatus;
	membership_plan_id: string | null;
	status: MemberStatus;
	created_at: string;
	updated_at: string;
}

export interface Member {
	id: string;

	firstName: string;

	lastName: string;

	dni: string;

	email?: string;

	phone?: string;

	startDate: string;

	renewalDate: string;

	membershipStatus: MembershipStatus;

	membershipPlanId?: string | null;

	status: MemberStatus;

	createdAt: string;

	updatedAt: string;
}
