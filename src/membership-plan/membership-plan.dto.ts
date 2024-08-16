export interface CreateMembershipPlanDto {
  name: string;
  duration: number;
  price: number;
}

export interface UpdateMembershipPlanDto
  extends Partial<CreateMembershipPlanDto> {
  id: string;
}
