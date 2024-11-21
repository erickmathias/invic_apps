import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PackageListComponent} from "./package-list/package-list.component";

const routes: Routes = [
  {path: '', component: PackageListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesRoutingModule { }
