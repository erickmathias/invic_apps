import { Clients } from "./clients.model";

export class Projects{
  id: number;
  name: string;
  type: string;
  company: number;
  client: Clients;
  prepared_by: string;
  date_prepared: Date;
  checked_by: string;
  date_checked: Date;
  reviewed_by: string;
  date_reviewed: Date;
  created_at: Date;
  updated_at: Date;
}
