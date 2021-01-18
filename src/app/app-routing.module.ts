import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'exam-select',
    loadChildren: () => import('./modals/exam-select/exam-select.module').then( m => m.ExamSelectPageModule)
  },
  {
    path: 'server-select',
    loadChildren: () => import('./modals/server-select/server-select.module').then( m => m.ServerSelectPageModule)
  },
  {
    path: 'class-select',
    loadChildren: () => import('./modals/class-select/class-select.module').then( m => m.ClassSelectPageModule)
  },
  {
    path: 'policy',
    loadChildren: () => import('./pages/policy/policy.module').then( m => m.PolicyPageModule)
  },
  {
    path: 'stats',
    loadChildren: () => import('./pages/stats/stats.module').then( m => m.StatsPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'item-details',
    loadChildren: () => import('./pages/item-details/item-details.module').then( m => m.ItemDetailsPageModule)
  },
  {
    path: 'candidat-edit',
    loadChildren: () => import('./pages/candidat-edit/candidat-edit.module').then( m => m.CandidatEditPageModule)
  },
  {
    path: 'bulletin',
    loadChildren: () => import('./pages/bulletin/bulletin.module').then( m => m.BulletinPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'code-premium',
    loadChildren: () => import('./pages/code-premium/code-premium.module').then( m => m.CodePremiumPageModule)
  },
  {
    path: 'payement',
    loadChildren: () => import('./pages/payement/payement.module').then( m => m.PayementPageModule)
  },
  {
    path: 'params-candidat',
    loadChildren: () => import('./pages/params-candidat/params-candidat.module').then( m => m.ParamsCandidatPageModule)
  },
  {
    path: 'card-payment',
    loadChildren: () => import('./pages/card-payment/card-payment.module').then( m => m.CardPaymentPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./pages/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  },
  {
    path: 'my-gifts',
    loadChildren: () => import('./pages/my-gifts/my-gifts.module').then( m => m.MyGiftsPageModule)
  },
  {
    path: 'selections-autorise',
    loadChildren: () => import('./pages/selections-autorise/selections-autorise.module').then( m => m.SelectionsAutorisePageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'notification-details',
    loadChildren: () => import('./pages/notification-details/notification-details.module').then( m => m.NotificationDetailsPageModule)
  },
  {
    path: 'vie-scolaire',
    loadChildren: () => import('./pages/vie-scolaire/vie-scolaire.module').then( m => m.VieScolairePageModule)
  },
  {
    path: 'notes',
    loadChildren: () => import('./pages/notes/notes.module').then( m => m.NotesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
