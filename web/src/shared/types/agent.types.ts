
export type AgentRole = 'AGENT';

export interface Agent {
  userId: string;
  role: AgentRole;
  agencyId: string;
  employeeCode: string;
}
