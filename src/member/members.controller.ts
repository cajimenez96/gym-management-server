import {
  CreateMemberDto,
  UpdateMemberDto,
  Member,
  MemberService,
} from '@/member';

export class MembersController {
  constructor(private readonly memberService: MemberService) {}

  create(createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberService.create(createMemberDto);
  }

  findAll(): Promise<Member[]> {
    return this.memberService.findAll();
  }

  update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    return this.memberService.update(id, updateMemberDto);
  }

  remove(id: string): Promise<Member> {
    return this.memberService.remove(id);
  }
}
