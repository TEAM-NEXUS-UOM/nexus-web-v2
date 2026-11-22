
import type { Agent } from '../types/agent.types.ts';

export const mockAgents: Agent[] = [
  {
    userId: 'a1b2c3d4-e5f6-4789-8123-123456789001',
    role: 'AGENT',
    agencyId: 'b1c2d3e4-f5a6-4789-8123-123456789001',
    employeeCode: 'AGT001',
  },
  {
    userId: 'a1b2c3d4-e5f6-4789-8123-123456789002',
    role: 'AGENT',
    agencyId: 'b1c2d3e4-f5a6-4789-8123-123456789001',
    employeeCode: 'AGT002',
  },
  {
    userId: 'a1b2c3d4-e5f6-4789-8123-123456789003',
    role: 'AGENT',
    agencyId: 'b1c2d3e4-f5a6-4789-8123-123456789002',
    employeeCode: 'AGT003',
  },
];
