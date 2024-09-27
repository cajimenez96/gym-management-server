import type {
	CreateMembershipPlanDto,
	MembershipPlan,
	MembershipPlanService,
	UpdateMembershipPlanDto,
} from '@/membership-plan';

export class MembershipPlansController {
	constructor(private readonly membershipPlansService: MembershipPlanService) {}

	create(
		createMembershipPlanDto: CreateMembershipPlanDto,
	): Promise<MembershipPlan> {
		return this.membershipPlansService.create(createMembershipPlanDto);
	}

	findAll(): Promise<MembershipPlan[]> {
		return this.membershipPlansService.findAll();
	}

	findOne(id: string): Promise<MembershipPlan> {
		return this.membershipPlansService.findOne(id);
	}

	update(
		id: string,
		membershipPlan: UpdateMembershipPlanDto,
	): Promise<MembershipPlan> {
		return this.membershipPlansService.update(id, membershipPlan);
	}

	remove(id: string): Promise<MembershipPlan> {
		return this.membershipPlansService.remove(id);
	}
}
