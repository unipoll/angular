import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { timer, tap } from 'rxjs';
import { GroupModel } from 'src/app/models/group.model';
import { MemberModel } from '../../models/member.model';
import { WorkspaceModel } from 'src/app/models/workspace.model';
import { ApiService } from 'src/app/services/api.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { DialogAddMemberComponent } from '../dialogs/dialog-add-member/dialog-add-member.component';
import { DialogDeleteComponent } from '../dialogs/dialog-delete/dialog-delete.component';
import { PolicyModel, SetPolicyRequest } from 'src/app/models/policy.model';
import { DialogSetPolicyComponent } from '../dialogs/dialog-set-policy/dialog-set-policy.component';

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.scss']
})
export class PolicyListComponent {
  // @Input() memberList!: UserShortModel[];
  @Input() workspace!: WorkspaceModel;
  @Input() group!: GroupModel;
  @Input() can_set_policies: boolean = false;

  displayedColumns!: string[];
  displayedColumnsWithOptions!: string[];
  dataSource!: MatTableDataSource<PolicyModel>;

  private loading = true;
  private timer = timer(3000);
  userFlow!: boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private route: ActivatedRoute, 
    private _dialog: MatDialog, 
    private workspaceService: WorkspaceService) { }

  ngOnInit(): void {
    if (window.innerWidth > 600) {
      this.displayedColumns = ['policy_holder', 'permissions'];
    } else {
      this.displayedColumns = ['permissions'];
    }
    this.displayedColumnsWithOptions = [...this.displayedColumns, 'options'];

    this.timer.subscribe(val => {
      if (val == 0) {
        this.loading = false;
      }
    });  
    this.updatePolicyList();
  }

  updatePolicyList() {
    if (this.group) {
      this.apiService.getAllGroupsPolicies(this.group.id).pipe(
        tap((data) => (
          this.makeTable(data.policies)
        ))
      ).subscribe();
    } else if (this.workspace) {
      this.apiService.getAllWorkspacesPolicies(this.workspace.id).pipe(
        tap((data) => (
          this.makeTable(data.policies)
        ))
      ).subscribe();
    }
  }

  makeFullName(policies: Array<PolicyModel>) {
    policies.forEach(policy => {
      if (policy.policy_holder_type == 'account') {
        let policy_holder = policy.policy_holder as MemberModel;
        policy.name = policy_holder.first_name + ' ' + policy_holder.last_name;
      } else if (policy.policy_holder_type == 'group') {
        let policy_holder = policy.policy_holder as GroupModel;
        policy.name = policy_holder.name;
      }
    });
  }

  makeTable(policies: Array<PolicyModel>) {
    this.makeFullName(policies),
    this.dataSource = new MatTableDataSource(policies),
    this.dataSource.paginator = this.paginator,
    this.dataSource.sort = this.sort
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Getter for loading
  get isLoading(): boolean {
    return this.loading;
  }

  editPolicy(policyData: PolicyModel) {
    let dialogRef;
    // By default, we are editing a workspace policy
    let resource = {
      type: 'workspace',
      id: this.workspace.id,
    };
    
    // If group is defined, then we are editing a group policy
    if (this.group) {
      resource = {
        type: 'group',
        id: this.group.id,
      };
    }
    

    let api_call;
    if (resource.type == 'group') {
      api_call = this.apiService.getGroupPermissions();
    } else if (resource.type == 'workspace') {
      api_call = this.apiService.getWorkspacePermissions();
    }

    if (api_call) {
      api_call.pipe(
        tap((allPermissions) => (
          console.log("All Permissions", allPermissions),
          dialogRef = this._dialog.open(DialogSetPolicyComponent, {
            data: {
              resource: resource,
              allPermissions:allPermissions.permissions,
              policy: policyData
            },
          }),
          dialogRef.afterClosed().subscribe({
            next: (val) => {
              if (val) {
                this.updatePolicyList();
              }
            },
          })
        ))
      ).subscribe();
    }

  }

  // removeMember(member: MemberModel) {
  //   let resource: { type: string; id: string; name: string; } | undefined;
  //   if (this.workspace) {
  //     resource = {
  //       type: 'workspace',
  //       id: this.workspace.id,
  //       name: `workspace ${this.workspace.name}`,
  //     };
  //   }
  //   if (resource) {
  //     const dialogRef = this._dialog.open(DialogDeleteComponent, {
  //       data: {
  //         resourceType: 'member',
  //         resourceID: resource.id,
  //         resourceName: resource.name,
  //         memberName: member.first_name + ' ' + member.last_name,
  //         memberID: member.id,
  //       }
  //     });

  //     dialogRef.afterClosed().subscribe({
  //       next: (val) => {
  //         if (val) {
  //           this.updateMemberList();
  //         }
  //       },
  //     });
  //   }
  // }
}