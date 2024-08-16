export interface DbCheckIn {
  id: string;

  member_id: string;

  date_time: string;

  created_at: string;
}

export interface CheckIn {
  id: string;

  memberId: string; // Foreign key to Member

  dateTime: string; // DateTime

  createdAt: string;
}
