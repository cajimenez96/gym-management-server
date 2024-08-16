import { Router } from 'express';
import { SupabaseService } from '@/supabase';
import {
  CreateMembershipPlanDto,
  MembershipPlanRepository,
  MembershipPlansController,
  MembershipPlanService,
  UpdateMembershipPlanDto,
} from '@/membership-plan';

interface MembershipPlanRouterDependencies {
  supabaseService: SupabaseService;
  membershipPlansRepository: MembershipPlanRepository;
  membershipPlansService: MembershipPlanService;
  membershipPlansController: MembershipPlansController;
}

export const createMembershipPlansRouter = ({
  membershipPlansController,
}: MembershipPlanRouterDependencies): Router => {
  const router = Router();

  router.post<unknown, unknown, CreateMembershipPlanDto>(
    '/',
    async (req, res) => {
      const result = await membershipPlansController.create(req.body);
      res.status(201).json(result);
    },
  );

  router.get('/', async (req, res) => {
    const result = await membershipPlansController.findAll();
    res.json(result);
  });

  router.get<{ id: string }>('/:id', async (req, res) => {
    const result = await membershipPlansController.findOne(req.params.id);
    res.json(result);
  });

  router.patch<{ id: string }, unknown, UpdateMembershipPlanDto>(
    '/:id',
    async (req, res) => {
      const result = await membershipPlansController.update(
        req.params.id,
        req.body,
      );
      res.json(result);
    },
  );

  router.delete<{ id: string }>('/:id', async (req, res) => {
    const result = await membershipPlansController.remove(req.params.id);
    res.json(result);
  });

  return router;
};
