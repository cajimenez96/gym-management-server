import { SupabaseService, Enums } from '@/supabase';
import { transformSupabaseResultToCamelCase } from '@/utils';
import { CreatePaymentResponse, Payment } from '@/payment';

export class PaymentRepository {
  private readonly tableName = 'payment';
  private readonly selectFields =
    'id, member_id, amount, date, plan_id, status, stripe_payment_intent_id, created_at, updated_at';

  constructor(private readonly supabaseService: SupabaseService) {}

  private get db() {
    return this.supabaseService.getClient().from(this.tableName);
  }

  async createPaymentRecord({
    memberId,
    planId,
    amount,
    stripePaymentIntentId,
  }: {
    memberId: string;
    planId: string;
    amount: number;
    stripePaymentIntentId: string;
  }): Promise<CreatePaymentResponse> {
    const { data, error } = await this.db
      .insert({
        member_id: memberId,
        amount,
        status: 'Pending',
        stripe_payment_intent_id: stripePaymentIntentId,
        plan_id: planId,
      })
      .select(this.selectFields)
      .single();

    if (error) {
      this.handleError(error, 'create payment record');
    }

    return {
      paymentId: data.id,
      clientSecret: null, // This will be set in the service
      paymentIntentId: data.stripe_payment_intent_id,
    };
  }

  async findPaymentByIntentId(paymentIntentId: string): Promise<Payment> {
    const { data, error } = await this.db
      .select(`${this.selectFields}, member(*)`)
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (error) {
      this.handleError(error, 'find payment by intent ID');
    }

    if (!data) {
      throw new Error(`Payment with intent ID ${paymentIntentId} not found`);
    }

    return transformSupabaseResultToCamelCase<Payment>(data);
  }

  async updatePaymentStatus(
    paymentId: string,
    status: Enums<'payment_status'>,
  ): Promise<void> {
    const { error } = await this.db
      .update({ status: status })
      .eq('id', paymentId);

    if (error) {
      this.handleError(error, 'update payment status');
    }
  }

  async findExistingMembership(memberId: string): Promise<any | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('membership')
      .select()
      .eq('member_id', memberId)
      .order('end_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'check existing membership');
    }

    return data;
  }

  async extendMembership(
    membershipId: string,
    newEndDate: string,
  ): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('membership')
      .update({ end_date: newEndDate })
      .eq('id', membershipId);

    if (error) {
      this.handleError(error, 'update membership');
    }
  }

  async createNewMembership({
    memberId,
    planId,
    startDate,
    endDate,
  }: {
    memberId: string;
    planId: string;
    startDate: string;
    endDate: string;
  }): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('membership')
      .insert({
        member_id: memberId,
        plan_id: planId,
        start_date: startDate,
        end_date: endDate,
        status: 'Active',
      });

    if (error) {
      this.handleError(error, 'create new membership');
    }
  }

  async getPaymentHistory(memberId?: string): Promise<Payment[]> {
    let query = this.db
      .select(this.selectFields)
      .order('date', { ascending: false });

    if (memberId) {
      query = query.eq('member_id', memberId);
    }

    const { data, error } = await query;

    if (error) {
      this.handleError(error, 'fetch payment history');
    }

    return transformSupabaseResultToCamelCase<Payment[]>(data);
  }

  private handleError(error: any, operation: string): never {
    if (error?.code === 'PGRST116') {
      throw new Error(`Payment not found for ${operation}`);
    }

    throw new Error(`Failed to ${operation}: ${error.message}`);
  }
}
