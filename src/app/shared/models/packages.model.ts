import { Clients } from "./clients.model";

export class Packages{
  id: number;
  module: string;
  name: string;
  description: string;
  cost: number;
  max_projects: number;
  watermark: number;
  status: number;
  created_at: Date;
  updated_at: Date;
}
