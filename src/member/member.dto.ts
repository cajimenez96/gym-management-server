import type { MemberStatus, MembershipStatus, MembershipPlan } from './member.entity';

export interface CreateMemberDto {
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
}

export type UpdateMemberDto = Partial<CreateMemberDto>;

export interface SearchMemberByDniDto {
	dni: string;
}

export interface RenewMembershipDto {
	dni: string;
	renewalDate: string;
	membershipPlan?: MembershipPlan;
}
