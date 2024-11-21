import {StandardCodes} from "./standard_codes.model";
import {SteelTypes} from "./steel_types";
import {UserProfile} from "./user-profile";
import {Projects} from "./projects.model";

export class Elements{
  id: number;
  name: string;
  project: Projects;
  std_code: StandardCodes;
  steel_type: SteelTypes;
  density: number;
  created_at: Date;
  updated_at: Date;
}
