import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "../profile/profile/profile.component";
import {MyClientsComponent} from "./my-clients/my-clients.component";

const routes: Routes = [
  {path: '', component: MyClientsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
