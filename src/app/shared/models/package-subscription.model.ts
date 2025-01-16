import { Clients } from "./clients.model";
import {Packages} from "./packages.model";

export class PackageSubscription {
  id: number;
  package: Packages;
  total_months: number;
  total_amount_billed: number;
  total_amount_paid: number;
  paid_status: number;
  status: number;
  company: number;
  user: number;
  paid_date: Date;
  due_date: Date;
  created_at: Date;
  updated_at: Date;
  gtw_redirect_url: string;
}
