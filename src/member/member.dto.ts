import type { MemberStatus, MembershipStatus } from './member.entity';

export interface CreateMemberDto {
	firstName: string;
	lastName: string;
	dni: string;
	email?: string;
	phone?: string;
	startDate: string;
	renewalDate: string;
	membershipStatus: MembershipStatus;
	membershipPlanId?: string | null;
	status: MemberStatus;
}

export type UpdateMemberDto = Partial<Omit<CreateMemberDto, 'dni'>> & { dni?: string };

export interface SearchMemberByDniDto {
	dni: string;
}

export interface RenewMembershipDto {
	dni: string;
	renewalDate: string;
	membershipPlanId?: string | null;
}

export interface MemberCheckInInfoDto {
	id: string; // ID del miembro
	firstName: string;
	lastName: string;
	startDate: string; // Fecha de ingreso, formateada
	renewalDate: string; // Próximo vencimiento, formateada
	planName: string | null; // Nombre del plan, puede ser null si no tiene plan
	membershipStatusText: string; // "Habilitado" o "No Habilitado"
}
