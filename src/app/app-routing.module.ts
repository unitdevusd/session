import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'intro',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/unitTabs/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  // {
  //   path: 'forgot-password',
  //   loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  // },
  // {
  //   path: 'phone-verification',
  //   loadChildren: () => import('./pages/auth/phone-verification/phone-verification.module').then( m => m.PhoneVerificationPageModule)
  // },
  // {
  //   path: 'select-role',
  //   loadChildren: () => import('./pages/auth/select-role/select-role.module').then( m => m.SelectRolePageModule)
  // },
  // {
  //   path: 'signup',
  //   loadChildren: () => import('./pages/auth/signup/signup.module').then( m => m.SignupPageModule)
  // },
  // {
  //   path: 'checkr',
  //   loadChildren: () => import('./pages/auth/checkr/checkr.module').then( m => m.CheckrPageModule)
  // },
  // {
  //   path: 'space-type',
  //   loadChildren: () => import('./pages/admin/space-type/space-type.module').then( m => m.SpaceTypePageModule)
  // },
  // {
  //   path: 'revenue-share',
  //   loadChildren: () => import('./pages/admin/revenue-share/revenue-share.module').then( m => m.RevenueSharePageModule)
  // },
  // {
  //   path: 'access-type',
  //   loadChildren: () => import('./pages/admin/access-type/access-type.module').then( m => m.AccessTypePageModule)
  // },
  // {
  //   path: 'add-feature',
  //   loadChildren: () => import('./pages/admin/add-feature/add-feature.module').then( m => m.AddFeaturePageModule)
  // },
  // {
  //   path: 'send-notifications',
  //   loadChildren: () => import('./pages/admin/send-notifications/send-notifications.module').then( m => m.SendNotificationsPageModule)
  // },
  // {
  //   path: 'access-period',
  //   loadChildren: () => import('./pages/admin/access-period/access-period.module').then( m => m.AccessPeriodPageModule)
  // },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  // {
  //   path: 'add-address',
  //   loadChildren: () => import('./pages/owner/add-address/add-address.module').then( m => m.AddAddressPageModule)
  // },
  // {
  //   path: 'edit-space',
  //   loadChildren: () => import('./pages/owner/edit-space/edit-space.module').then( m => m.EditSpacePageModule)
  // },
  // {
  //   path: 'view-earnings',
  //   loadChildren: () => import('./pages/owner/view-earnings/view-earnings.module').then( m => m.ViewEarningsPageModule)
  // },
  // {
  //   path: 'space-details',
  //   loadChildren: () => import('./pages/owner/Add-space/space-details/space-details.module').then( m => m.SpaceDetailsPageModule)
  // },
  // {
  //   path: 'space-publish',
  //   loadChildren: () => import('./pages/owner/Add-space/space-publish/space-publish.module').then( m => m.SpacePublishPageModule)
  // },
  // {
  //   path: 'edit-profile',
  //   loadChildren: () => import('./pages/auth/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  // },
  // {
  //   path: 'change-password',
  //   loadChildren: () => import('./pages/auth/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  // },
  // {
  //   path: 'location',
  //   loadChildren: () => import('./pages/owner/location-select/location-select.module').then( m => m.LocationSelectPageModule)
  // },
  // {
  //   path: 'space-properties',
  //   loadChildren: () => import('./pages/owner/Add-space/space-properties/space-properties.module').then( m => m.SpacePropertiesPageModule)
  // },
  // {
  //   path: 'space-description',
  //   loadChildren: () => import('./pages/owner/Add-space/space-description/space-description.module').then( m => m.SpaceDescriptionPageModule)
  // },
  // {
  //   path: 'space-features',
  //   loadChildren: () => import('./pages/owner/Add-space/space-features/space-features.module').then( m => m.SpaceFeaturesPageModule)
  // },
  // {
  //   path: 'edit-space',
  //   loadChildren: () => import('./pages/owner/Add-space/edit-space/edit-space.module').then( m => m.EditSpacePageModule)
  // },
  // {
  //   path: 'place-detail',
  //   loadChildren: () => import('./pages/tanent/place-detail/place-detail.module').then( m => m.PlaceDetailPageModule)
  // },
  // {
  //   path: 'start-booking',
  //   loadChildren: () => import('./pages/tanent/start-booking/start-booking.module').then( m => m.StartBookingPageModule)
  // },
  // {
  //   path: 'show-payment-info',
  //   loadChildren: () => import('./pages/tanent/show-payment-info/show-payment-info.module').then( m => m.ShowPaymentInfoPageModule)
  // },
  // {
  //   path: 'booking-detail/:id',
  //   loadChildren: () => import('./pages/owner/booking-detail/booking-detail.module').then( m => m.BookingDetailPageModule)
  // },
  // {
  //   path: 'confirm-payment',
  //   loadChildren: () => import('./pages/tanent/confirm-payment/confirm-payment.module').then( m => m.ConfirmPaymentPageModule)
  // },
  // {
  //   path: 'payment',
  //   loadChildren: () => import('./pages/tanent/payment/payment.module').then( m => m.PaymentPageModule)
  // },
  // {
  //   path: 'select-type',
  //   loadChildren: () => import('./pages/tanent/select-type/select-type.module').then( m => m.SelectTypePageModule)
  // },
  // {
  //   path: 'pick-up',
  //   loadChildren: () => import('./pages/tanent/pick-up/pick-up.module').then( m => m.PickUpPageModule)
  // },
  // {
  //   path: 'extend-booking',
  //   loadChildren: () => import('./pages/tanent/extend-booking/extend-booking.module').then( m => m.ExtendBookingPageModule)
  // },
  // {
  //   path: 'request-for-extension',
  //   loadChildren: () => import('./pages/owner/request-for-extension/request-for-extension.module').then( m => m.RequestForExtensionPageModule)
  // },
  // {
  //   path: 'payment-for-extension',
  //   loadChildren: () => import('./pages/tanent/payment-for-extension/payment-for-extension.module').then( m => m.PaymentForExtensionPageModule)
  // },
  // {
  //   path: 'invite',
  //   loadChildren: () => import('./pages/auth/invite/invite.module').then( m => m.InvitePageModule)
  // },
  // {
  //   path: 'stored-item-type',
  //   loadChildren: () => import('./pages/admin/item-storeage-type/item-storeage-type.module').then( m => m.ItemStoreageTypePageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
