import {StandardCodes} from "./standard_codes.model";
import {SteelTypes} from "./steel_types";

export class BbsFormulas{
  id: number;
  std_code: number;
  shape_code: number;
  formula: string;
  d6: number;
  d8: number;
  d10: number;
  d12: number;
  d16 : number;
  d20: number;
  d25: number;
  d32: number;
  d40: number;
  d50: number;
  steel_type_t: number;
  steel_type_y: number;
  steel_type_r: number;
  created_at: Date;
  updated_at: Date;
}
