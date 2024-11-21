import {Projects} from "./projects.model";
import {Elements} from "./elements.model";
import {BbsFormulas} from "./bbs-formulas.model";
import {SlabPanelProperties} from "./slab-panel-properties.model";

export class MaterialLoadingProperties{
  id: number;
  project: Projects;
  slap_panel: SlabPanelProperties;
  concrete_strength: number;
  concrete_steel_cover: number;
  concrete_density: number;
  concrete_wc_ratio: number;
  steel_strength: number;
  steel_bott1_size: number;
  steel_bott2_size: number;
  steel_top1_size: number;
  steel_top2_size: number;
  steel_density: number;
  steel_bott1_gap: number;
  steel_bott2_gap: number;
  steel_top1_gap: number;
  steel_top2_gap: number;
  dead_loading_finishes: number;
  dead_loading_partition: number;
  dead_loading_services: number;
  live_loading_imposed: number;
  negative_short_span: number;
  negative_long_span: number;
  positive_short_span: number;
  positive_long_span: number;
  created_at: Date;
  updated_at: Date;
}
