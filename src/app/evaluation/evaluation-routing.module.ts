import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BooksComponent } from './pages/books/books.component';
import { BookComponent } from './pages/book/book.component';
import { AuthorsComponent } from './pages/authors/authors.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [

  { path: '', 
    component: HomeComponent, 
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'books', component: BooksComponent },
      { path: 'book', component: BookComponent },
      { path: 'book/:id', component: BookComponent },
      { path: 'authors', component: AuthorsComponent }, 
      { path: '**', redirectTo: 'dashboard' }   
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationRoutingModule { }
