import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SubscriptionListComponent} from "./subscription-list/subscription-list.component";
import {PesaPallOrderRequestComponent} from "../../../pages/pesa-pall-order-request/pesa-pall-order-request.component";

const routes: Routes = [
  {path: '', component: SubscriptionListComponent},
  // {path: 'order-request', component: PesaPallOrderRequestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionsRoutingModule { }
