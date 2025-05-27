import { MembershipDuration } from './membership-plan.entity';

export interface CreateMembershipPlanDto {
	name: string;
	duration: MembershipDuration;
	price: number;
}

export interface UpdateMembershipPlanDto
	extends Partial<CreateMembershipPlanDto> {
	id: string;
}
