import { CheckInService, CheckIn } from '@/check-in';

export class CheckInsController {
  constructor(private readonly checkInService: CheckInService) {}

  async createCheckIn(memberId: string): Promise<CheckIn> {
    return this.checkInService.createCheckIn(memberId);
  }

  async getHistoricalCheckIns(memberId?: string): Promise<CheckIn[]> {
    return this.checkInService.getHistoricalCheckIns(memberId);
  }
}
