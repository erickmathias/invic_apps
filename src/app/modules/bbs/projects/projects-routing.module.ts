import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MyProjectsComponent} from "./my-projects/my-projects.component";

const routes: Routes = [
  {path: '', component: MyProjectsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
