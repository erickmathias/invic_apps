import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../../core/guards/auth.guard";
import {SlabHomeComponent} from "./slab-home/slab-home.component";
import {MyProjectsComponent} from "../bbs/projects/my-projects/my-projects.component";

const routes: Routes = [
  { path: '', component: SlabHomeComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: MyProjectsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlubRoutingModule { }
