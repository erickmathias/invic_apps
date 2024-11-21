import {StandardCodes} from "./standard_codes.model";
import {SteelTypes} from "./steel_types";
import {UserProfile} from "./user-profile";
import {Projects} from "./projects.model";
import {PanelSupport} from "./panel_support.model";
import {SpProperties} from "./sp_properties.model";

export class SlabPanelProperties{
  id: number;
  name: string;
  project: Projects;
  panel_support: PanelSupport;
  property: SpProperties;
  long_length: number;
  short_length: number;
  thickness: number;
  created_at: Date;
  updated_at: Date;
}
