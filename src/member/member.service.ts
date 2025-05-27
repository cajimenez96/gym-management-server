import type {
	CreateMemberDto,
	Member,
	MemberRepository,
	UpdateMemberDto,
	SearchMemberByDniDto,
	RenewMembershipDto,
} from '@/member';
import { MembershipStatus } from '@/member';

export class MemberService {
	constructor(private readonly memberRepository: MemberRepository) {}

	async create(createMemberDto: CreateMemberDto): Promise<Member> {
		// Validate DNI uniqueness
		const existingMember = await this.memberRepository.findByDni(
			createMemberDto.dni,
		);

		if (existingMember) {
			throw new Error(
				`Member with DNI ${createMemberDto.dni} already exists`,
			);
		}

		// Auto-calculate membership status based on renewal date
		const now = new Date();
		const renewalDate = new Date(createMemberDto.renewalDate);
		const membershipStatus: MembershipStatus = renewalDate > now ? MembershipStatus.Active : MembershipStatus.Expired;

		const memberToCreate = {
			...createMemberDto,
			membershipStatus,
		};

		return this.memberRepository.create(memberToCreate);
	}

	async findAll(): Promise<Member[]> {
		return this.memberRepository.findAll();
	}

	async findById(id: string): Promise<Member> {
		const member = await this.memberRepository.findById(id);

		if (!member) {
			throw new Error(`Member with ID ${id} not found`);
		}

		return member;
	}

	async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
		// Check if member exists
		await this.findById(id);

		// If email is being updated, check for uniqueness
		if (updateMemberDto.email) {
			const existingMember = await this.memberRepository.findByEmail(
				updateMemberDto.email,
			);

			if (existingMember && existingMember.id !== id) {
				throw new Error(
					`Member with email ${updateMemberDto.email} already exists`,
				);
			}
		}

		return this.memberRepository.update(id, updateMemberDto);
	}

	async remove(id: string): Promise<Member> {
		return this.memberRepository.remove(id);
	}

	async findByDni(dni: string): Promise<Member | null> {
		return this.memberRepository.findByDni(dni);
	}

	async renewMembership(renewDto: RenewMembershipDto): Promise<Member> {
		// Verify member exists
		const existingMember = await this.memberRepository.findByDni(renewDto.dni);
		if (!existingMember) {
			throw new Error(`Member with DNI ${renewDto.dni} not found`);
		}

		// Calculate renewal date (default to 1 month from current renewal date)
		let newRenewalDate: string;
		if (renewDto.renewalDate) {
			newRenewalDate = renewDto.renewalDate;
		} else {
			// Add 1 month to current renewal date
			const currentRenewal = new Date(existingMember.renewalDate);
			currentRenewal.setMonth(currentRenewal.getMonth() + 1);
			newRenewalDate = currentRenewal.toISOString();
		}

		return this.memberRepository.renewMembership(
			renewDto.dni,
			newRenewalDate,
			renewDto.membershipPlan,
		);
	}

	async updateMemberStatuses(): Promise<void> {
		// Update all members' membership status based on their renewal date
		return this.memberRepository.updateEstadoByFechaRenovacion();
	}

	async getActiveMembers(): Promise<Member[]> {
		const allMembers = await this.memberRepository.findAll();
		return allMembers.filter(member => member.membershipStatus === MembershipStatus.Active);
	}

	async getExpiredMembers(): Promise<Member[]> {
		const allMembers = await this.memberRepository.findAll();
		return allMembers.filter(member => member.membershipStatus === MembershipStatus.Expired);
	}
}
