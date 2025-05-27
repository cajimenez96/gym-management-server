export enum MemberStatus {
	Active = 'Active',
	Inactive = 'Inactive',
	Suspended = 'Suspended',
}

export enum MembershipStatus {
	Active = 'active',
	Expired = 'expired',
}

export enum MembershipPlan {
	Monthly = 'monthly',
	Custom = 'custom',
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
	membership_plan: MembershipPlan;
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

	membershipPlan: MembershipPlan;

	status: MemberStatus;

	createdAt: string;

	updatedAt: string;
}
