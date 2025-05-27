import type {
	CreateMemberDto,
	Member,
	MemberRepository,
	UpdateMemberDto,
	SearchMemberByDniDto,
	RenewMembershipDto,
	MemberCheckInInfoDto,
} from '@/member';
import { MembershipStatus } from '@/member';
import type { MembershipPlanRepository, MembershipPlan } from '@/membership-plan';

export class MemberService {
	constructor(
		private readonly memberRepository: MemberRepository,
		private readonly membershipPlanRepository: MembershipPlanRepository,
	) {}

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
			renewDto.membershipPlanId,
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

	async getMemberDetailsForCheckInByDni(dni: string): Promise<MemberCheckInInfoDto> {
		const member = await this.memberRepository.findByDni(dni);
		if (!member) {
			// Consider using a custom error type or status code for client handling
			const error = new Error(`Miembro con DNI ${dni} no encontrado.`);
			(error as any).status = 404; 
			throw error;
		}

		let planName: string | null = null;
		if (member.membershipPlanId) {
			try {
				const plan = await this.membershipPlanRepository.findOne(member.membershipPlanId);
				planName = plan.name;
			} catch (error) {
				console.warn(`Plan con ID ${member.membershipPlanId} no encontrado para miembro ${member.id}. Error: ${(error as Error).message}`);
				// Decidir si se debe mostrar un error específico del plan o simplemente "N/A" o similar
				planName = 'Plan no asignado o no encontrado'; 
			}
		}

		const membershipStatusText = member.membershipStatus === MembershipStatus.Active 
			? 'Habilitado' 
			: 'No Habilitado';

		// Usar toLocaleDateString para un formato más amigable.
		// Asegúrate de que las fechas sean válidas antes de intentar formatearlas.
		const startDateFormatted = member.startDate 
			? new Date(member.startDate).toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })
			: 'N/A'; 
		const renewalDateFormatted = member.renewalDate 
			? new Date(member.renewalDate).toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })
			: 'N/A';

		return {
			id: member.id,
			firstName: member.firstName,
			lastName: member.lastName,
			startDate: startDateFormatted,
			renewalDate: renewalDateFormatted,
			planName: planName,
			membershipStatusText: membershipStatusText,
		};
	}
}
