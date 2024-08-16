export enum PaymentStatus {
  SUCCESSFUL = 'Successful',
  FAILED = 'Failed',
  PENDING = 'Pending',
}

export interface DbPayment {
  id: string;
  member_id: string;
  amount: number;
  date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;

  memberId: string; // Foreign key to Member

  planId: string; // Foreign key to MembershipPlan

  amount: number; // Decimal

  date: string; // DateTime

  status: PaymentStatus;

  createdAt: string;

  updatedAt: string;
}
