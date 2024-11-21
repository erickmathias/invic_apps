import { Clients } from "./clients.model";
import {Projects} from "./projects.model";

export class UserProfile {
  username: string;
  role: number;
  token: string;
  mobile: any;
  dial_code: number;
  id: number;
  name: string;
  email: string;
  fax: string;
  main_activity: string;
  postal_address: string;
  country: any;
  region: any;
  municipal: any;
  website: any;
  created_at: any;
  date_joined: any;
  photoBase64: any;
  clients: Clients[];
  projects: Projects[];
  user: any;
  logo: any;
}
