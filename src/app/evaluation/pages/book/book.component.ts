import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Author } from '../../interfaces/author.model';
import { Observable, Subject, map, of, startWith, takeUntil } from 'rxjs';
import { AuthorService } from '../../services/author.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthorDialogComponent } from '../../components/author-dialog/author-dialog.component';
import { BookService } from '../../services/book.service';
import { Book } from '../../interfaces/book.interface';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit, OnDestroy {
  
  bookForm: FormGroup;
  authors: Author[] = [];
  filteredAuthors: Observable<Author[]> = of([]);
  private unsubscribe$ = new Subject<void>();
  bookId?: number;

  constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private bookService: BookService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      authorId: ['', Validators.required],
      published: [false],
      year: [new Date().getFullYear(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.bookId = +id;
          this.loadBook(this.bookId);
        }
      });

    this.authorService.getAuthors()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(authors => {
        this.authors = authors;
        this.filteredAuthors = this.bookForm.controls['authorId'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadBook(id: number): void {
    this.bookService.getBookById(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(book => {
        const selectedAuthor = this.authors.find(author => author.id == book.authorId);
        
        this.bookForm.patchValue({
          title: book.title,
          description: book.description,
          authorId: selectedAuthor,
          published: book.published,
          year: book.year
        });
      });
  }

  private _filter(value: string): Author[] {
    //const filterValue = value.toLowerCase();
    return this.authors.filter(option => option.name.toLowerCase().includes(value));
  }

  displayAuthorName(author?: Author): string {
    return author ? author.name : '';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authorService.addAuthor(result)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(newAuthor => {
            this.authors.push(newAuthor);
            this.filteredAuthors = this.bookForm.controls['authorId'].valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value))
            );
            this.bookForm.controls['authorId'].setValue(newAuthor);
          });
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const selectedAuthor: Author | undefined = this.bookForm.controls['authorId'].value;
      if (!selectedAuthor) {
        console.error('El autor seleccionado es inválido.');
        return;
      }

      const newBook: Book = {
        id: this.bookId?.toString() ?? undefined,
        title: this.bookForm.value.title,
        description: this.bookForm.value.description,
        year: Number(this.bookForm.value.year),
        authorId: selectedAuthor.id!,
        published: this.bookForm.value.published,
        registrationDate: new Date().toISOString().split('T')[0]
      };

      if (this.bookId) {
        this.bookService.updateBook(newBook)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (book: Book) => {
              this.notificationService.showNotification('Libro actualizado exitosamente.');
              this.router.navigate(['app/books']);
            },
            error: (e) => {
              console.error('Error updating book:', e);
              this.notificationService.showNotification('Error al actualizar el libro.');

            },
          });
      } else {
        this.bookService.addBook(newBook).subscribe({
          next: (book: Book) => {
            this.notificationService.showNotification('Libro registrado exitosamente.');
            console.log('Book registered:', book);
            //this.bookForm.reset();
            this.router.navigate(['app/books']);
          },
          error: (e) => {
            console.error('Error registering book:', e);
            this.notificationService.showNotification('Error al registrar el libro.');
          }
        });
      }

     
    }
  }

  onCancel(): void {
    //this.bookForm.reset();
    this.router.navigate(['app/books']);
  }

}
