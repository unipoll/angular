import { Component, OnInit, ViewChild } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { ApiService } from 'src/app/core/services/api.service';

import { WorkspaceModel } from 'src/app/models/workspace.model';

import { DialogCreateWorkspaceComponent } from '../dialog-create-workspace/dialog-create-workspace.component';
import { DialogUpdateWorkspaceComponent } from '../dialog-update-workspace/dialog-update-workspace.component';
import { DialogDeleteWorkspaceComponent } from '../dialog-delete-workspace/dialog-delete-workspace.component';
import { GridOrTableViewComponent } from 'src/app/shared/components/grid-or-table-view/grid-or-table-view.component';



@Component({
	selector: 'app-workspace-list',
	templateUrl: './workspace-list.component.html',
	styleUrls: ['./workspace-list.component.scss']
})
export class WorkspaceListComponent implements OnInit {
	displayedColumns = ['name', 'description'];
	workspaceList!: WorkspaceModel[];
	permissions!: string[];

	@ViewChild(GridOrTableViewComponent) gridOrTableViewComponent!: GridOrTableViewComponent;

	optionsMenu = [
		{
			label: 'View',
			action: (workspace: WorkspaceModel) => this.getWorkspace(workspace)
		},
		{
			label: 'Edit',
			action: (workspace: WorkspaceModel) => this.editWorkspace(workspace)
		},
		{
			label: 'Delete',
			action: (workspace: WorkspaceModel) => this.deleteWorkspace(workspace)
		}
	]

	constructor(
		private apiService: ApiService,
		private router: Router,
		private route: ActivatedRoute,
		private dialog: MatDialog) {
	}

	ngOnInit(): void {
		this.updateWorkspaceList();
	}

	updateWorkspaceList() {
		this.apiService.getUserWorkspaces().pipe(
			tap((data) => (
				this.workspaceList = data.workspaces
			))
		).subscribe();
	}

	getWorkspace(workspace: WorkspaceModel) {
		this.router.navigate([workspace.id], {
			relativeTo: this.route
		});
	}

	createWorkspace() {
		const dialogRef = this.dialog.open(DialogCreateWorkspaceComponent);

		dialogRef.afterClosed().subscribe({
			next: (val) => {
				if (val) {
					// this.updateWorkspaceList();
					this.workspaceList.push(val);
					this.gridOrTableViewComponent.updateList(this.workspaceList);
				}
			},
		});
	}

	editWorkspace(workspace: WorkspaceModel) {
		const dialogRef = this.dialog.open(DialogUpdateWorkspaceComponent, { 
			data: {
				workspace: workspace
			}
		});
		dialogRef.afterClosed().subscribe({
			next: (val) => {
				if (val) {
					// this.updateWorkspaceList();
					this.workspaceList.forEach((item, index) => {
						if (item.id === val.id) {
							this.workspaceList[index] = val;
						}
					});
					this.gridOrTableViewComponent.updateList(this.workspaceList);
				}
			},
		});
	}

	deleteWorkspace(workspace: WorkspaceModel): void {
		const dialogRef = this.dialog.open(DialogDeleteWorkspaceComponent, {
			data: {
				workspace: workspace
			}
		});

		dialogRef.afterClosed().subscribe({
			next: (val) => {
				console.log("Dialog output");
				if (val) {
					// this.updateWorkspaceList();
					this.workspaceList = this.workspaceList.filter((item) => item.id !== workspace.id);
					this.gridOrTableViewComponent.updateList(this.workspaceList);
					// this.gridOrTableViewComponent.deleteItem(this);
				}
			},
		});
	}

}