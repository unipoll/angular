import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PollModel } from 'src/app/models/poll.model';
import { WorkspaceModel } from 'src/app/models/workspace.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {
  @Input() workspace!: WorkspaceModel;

  public poll!: PollModel;
  public poll_id!: string;
  
  constructor(
    private router: Router,
    private apiService: ApiService,
    ) {
      this.poll_id = this.router.getCurrentNavigation()?.extras?.state?.['poll_id'];
  }

  ngOnInit(): void {
    this.getPoll();
  }

  getPoll() {
    this.apiService.getPoll(this.poll_id, true, true).subscribe((response: any) => {
      this.poll = response;
      this.workspace = response.workspace;
    });
  }
}
