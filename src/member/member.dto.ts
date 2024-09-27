import type { MemberStatus } from './member.entity';

export interface CreateMemberDto {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	status: MemberStatus;
}

export type UpdateMemberDto = Partial<CreateMemberDto>;
