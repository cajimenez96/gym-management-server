import { Router } from 'express';
import { SupabaseService } from '@/supabase';
import {
  MemberService,
  MembersController,
  MemberRepository,
  CreateMemberDto,
  UpdateMemberDto,
} from '@/member';

interface MemberRouterDependencies {
  supabaseService: SupabaseService;
  memberRepository: MemberRepository;
  memberService: MemberService;
  membersController: MembersController;
}

export const createMembersRouter = ({
  membersController,
}: MemberRouterDependencies): Router => {
  const router = Router();

  router.post<unknown, unknown, CreateMemberDto>('/', async (req, res) => {
    const result = await membersController.create(req.body);
    res.status(201).json(result);
  });

  router.get('/', async (req, res) => {
    const result = await membersController.findAll();
    res.json(result);
    // res.status(500).json({ error: 'Internal Server Error' });
  });

  router.patch<{ id: string }, unknown, UpdateMemberDto>(
    '/:id',
    async (req, res) => {
      const result = await membersController.update(req.params.id, req.body);
      res.json(result);
    },
  );

  router.delete<{ id: string }>('/:id', async (req, res) => {
    const result = await membersController.remove(req.params.id);
    res.json(result);
  });

  return router;
};
