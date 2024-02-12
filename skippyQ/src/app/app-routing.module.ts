import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'user-info',
    loadChildren: () => import('./user-info/user-info.module').then( m => m.UserInfoPageModule)
  },
  {
    path: 'rewards',
    loadChildren: () => import('./rewards/rewards.module').then( m => m.RewardsPageModule)
  },
  {
    path: 'waste-sorter',
    loadChildren: () => import('./waste-sorter/waste-sorter.module').then( m => m.WasteSorterPageModule)
  },
  {
    path: 'image-sort',
    loadChildren: () => import('./image-sort/image-sort.module').then( m => m.ImageSortPageModule)
  },
  {
    path: 'text-sort',
    loadChildren: () => import('./text-sort/text-sort.module').then( m => m.TextSortPageModule)
  },
  {
    path: 'recycle-info/:id',
    loadChildren: () => import('./recycle-info/recycle-info.module').then( m => m.RecycleInfoPageModule)
  },
  {
    path: 'edit-recycle-info/:id',
    loadChildren: () => import('./edit-recycle-info/edit-recycle-info.module').then( m => m.EditRecycleInfoPageModule)
  },
  {
    path: 'recycle-examples',
    loadChildren: () => import('./recycle-examples/recycle-examples.module').then( m => m.RecycleExamplesPageModule)
  },
  {
    path: 'seller',
    loadChildren: () => import('./seller/seller.module').then( m => m.SellerPageModule)
  },
  {
    path: 'edit-product/:id',
    loadChildren: () => import('./edit-product/edit-product.module').then( m => m.EditProductPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'adminlisting/:userID',
    loadChildren: () => import('./adminlisting/adminlisting.module').then( m => m.AdminlistingPageModule)
  },   
  {
    path: 'admintrans/:id',
    loadChildren: () => import('./admin-trans/admin-trans.module').then( m => m.AdminTransPageModule)
  },
  {
    path: 'notif',
    loadChildren: () => import('./notif/notif.module').then( m => m.NotifPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
