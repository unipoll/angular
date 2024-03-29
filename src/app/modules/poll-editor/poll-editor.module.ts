import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleChoiceComponent } from '../../components/poll-editor/questions/single-choice/single-choice.component';
import { MultipleChoiceComponent } from '../../components/poll-editor/questions/multiple-choice/multiple-choice.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    SingleChoiceComponent,
    MultipleChoiceComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MarkdownModule.forChild()
  ],
  exports: [
    SingleChoiceComponent,
    MultipleChoiceComponent
  ]
})
export class PollEditorModule { }
