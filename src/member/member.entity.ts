export enum MemberStatus {
	Active = 'Active',
	Inactive = 'Inactive',
	Suspended = 'Suspended',
}

export interface DbMember {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone?: string;
	status: MemberStatus;
	created_at: string;
	updated_at: string;
}

export interface Member {
	id: string;

	firstName: string;

	lastName: string;

	email: string;

	phone?: string;

	status: MemberStatus;

	createdAt: string;

	updatedAt: string;
}
