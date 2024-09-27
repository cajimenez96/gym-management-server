import type {
	CreateMemberDto,
	Member,
	MemberRepository,
	UpdateMemberDto,
} from '@/member';

export class MemberService {
	constructor(private readonly memberRepository: MemberRepository) {}

	async create(createMemberDto: CreateMemberDto): Promise<Member> {
		// Validate email uniqueness
		const existingMember = await this.memberRepository.findByEmail(
			createMemberDto.email,
		);

		if (existingMember) {
			throw new Error(
				`Member with email ${createMemberDto.email} already exists`,
			);
		}

		return this.memberRepository.create(createMemberDto);
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
}
