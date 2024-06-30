import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BookService } from '../../services/book.service';
import { Book } from '../../interfaces/book.interface';
import { Router } from '@angular/router';
import { Author } from '../../interfaces/author.model';
import { NotificationService } from '../../services/notification.service';
import { AuthorService } from '../../services/author.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'title', 'description', 'year', 'author', 'published', 'registrationDate', 'accion'];
  dataSource: MatTableDataSource<Book> = new MatTableDataSource<Book>();
  authors: Author[] = [];
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookService: BookService, 
    private router: Router,
    private notificationService: NotificationService,
    private authorService: AuthorService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadBooks(): void {
    this.bookService.getBooks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(books => {
        console.log('books', books);
        this.dataSource = new MatTableDataSource(books);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  loadAuthors(): void {
    this.authorService.getAuthors()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(authors => {
        this.authors = authors;
      });
  }

  getAuthorName(authorId: string): string {
    const author = this.authors.find(a => a.id === authorId);
    return author ? author.name : 'Desconocido';
  }

  editBook(id: number): void {
    this.router.navigate(['app/book', id]);
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: '¿Está seguro de que desea eliminar este libro?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteBook(id);
      }
    });
  }

  deleteBook(id: number): void {
    this.bookService.deleteBook(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showNotification('Libro eliminado exitosamente.');
          this.loadBooks();
        },
        error: (e) => {
            console.error('Error deleting book:', e);
            this.notificationService.showNotification('Error al eliminar el libro.');
        } 
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onNewBook(): void {
    this.router.navigate(['app/book']);
  }

}
