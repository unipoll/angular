import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { WorkspaceListComponent } from './components/workspace-list/workspace-list.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AuthGuard } from './auth.guard';
import { GroupListComponent } from './components/group-list/group-list.component';
import { GroupComponent } from './components/group/group.component';
import { PollEditorComponent } from './components/poll-editor/poll-editor.component';
import { PollComponent } from './components/poll/poll.component';

const routes: Routes = [
  { path: '', redirectTo: 'workspaces', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'workspaces', component: WorkspaceListComponent, canActivate: [AuthGuard] },
  { 
    path: 'workspace', 
    component: WorkspaceComponent, 
    canActivate: [AuthGuard],
  },
  { path: 'workspace/new-poll', component: PollEditorComponent, canActivate: [AuthGuard] },
  { path: 'group', component: GroupComponent, canActivate: [AuthGuard]},
  { path: 'poll', component: PollComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
