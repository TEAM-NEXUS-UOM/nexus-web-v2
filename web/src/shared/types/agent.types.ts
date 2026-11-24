

import { type Id, type Address , type AuditFields, type ContactInfo, type AccountStatus } from "./common";
export type AgentRole = 'AGENT';

export interface Agent extends Address , AuditFields , ContactInfo{

  userId: Id
  fullname:string;
  nic:string;
  role: AgentRole;
  status:AccountStatus
  agencyId: string | null ;
  employeeCode: string;
}
