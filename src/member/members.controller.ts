import type {
	CreateMemberDto,
	Member,
	MemberService,
	UpdateMemberDto,
	SearchMemberByDniDto,
	RenewMembershipDto,
	MemberCheckInInfoDto,
} from '@/member';

export class MembersController {
	constructor(private readonly memberService: MemberService) {}

	create(createMemberDto: CreateMemberDto): Promise<Member> {
		return this.memberService.create(createMemberDto);
	}

	findAll(): Promise<Member[]> {
		return this.memberService.findAll();
	}

	findById(id: string): Promise<Member> {
		return this.memberService.findById(id);
	}

	findByDni(dni: string): Promise<Member | null> {
		return this.memberService.findByDni(dni);
	}

	update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
		return this.memberService.update(id, updateMemberDto);
	}

	renewMembership(renewDto: RenewMembershipDto): Promise<Member> {
		return this.memberService.renewMembership(renewDto);
	}

	remove(id: string): Promise<Member> {
		return this.memberService.remove(id);
	}

	getActiveMembers(): Promise<Member[]> {
		return this.memberService.getActiveMembers();
	}

	getExpiredMembers(): Promise<Member[]> {
		return this.memberService.getExpiredMembers();
	}

	updateMemberStatuses(): Promise<void> {
		return this.memberService.updateMemberStatuses();
	}

	async getCheckInInfoByDni(dni: string): Promise<MemberCheckInInfoDto> {
		return this.memberService.getMemberDetailsForCheckInByDni(dni);
	}
}
