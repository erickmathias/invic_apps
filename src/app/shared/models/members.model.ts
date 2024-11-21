import {Projects} from "./projects.model";
import {Elements} from "./elements.model";
import {BbsFormulas} from "./bbs-formulas.model";

export class Members{
  id: number;
  name: string;
  project: Projects;
  element: Elements;
  bar_mark: string;
  bar_size: string;
  total_members: number;
  number_of_bars: number;
  total_length_of_bars: number;
  shape_code: BbsFormulas;
  dx: number;
  length_a: number;
  length_b: number;
  length_c: number;
  length_d: number;
  length_e: number;
  length_f: number;
  length_r: number;
  created_at: Date;
  updated_at: Date;
}
