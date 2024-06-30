import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EvaluationRoutingModule } from './evaluation-routing.module';
import { BookComponent } from './pages/book/book.component';
import { BooksComponent } from './pages/books/books.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { HomeComponent } from './pages/home/home.component';
import { CoreModule } from '../core/core.module';
import { AuthorDialogComponent } from './components/author-dialog/author-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { AuthorsComponent } from './pages/authors/authors.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { DateFormatDirective } from '../shared/directives/date-format.directive';

@NgModule({
  declarations: [
    BookComponent,
    BooksComponent,
    DashboardComponent,
    HomeComponent,
    AuthorDialogComponent,
    ConfirmationDialogComponent,
    AuthorsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    EvaluationRoutingModule,
    RouterModule,
    MaterialModule,
    SharedModule,
    MaterialModule,
    CoreModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts,
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class EvaluationModule { }
