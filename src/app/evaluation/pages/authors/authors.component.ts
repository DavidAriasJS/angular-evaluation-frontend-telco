import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Author } from '../../interfaces/author.model';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthorService } from '../../services/author.service';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthorDialogComponent } from '../../components/author-dialog/author-dialog.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Author>();
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authorService: AuthorService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadAuthors(): void {
    this.authorService.getAuthors()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(authors => {
        this.dataSource.data = authors;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      if (result === 'saved') {
        this.loadAuthors();
      }
    });
  }

  editAuthor(author: Author): void {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      width: '400px',
      data: { author }
    });

    dialogRef.afterClosed()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      if (result === 'saved') {
        this.loadAuthors();
      }
    });
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: '¿Está seguro de que desea eliminar este autor?' }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
      if (result === 'confirm') {
        this.authorService.deleteAuthor(id)
        .subscribe({
          next: () => {
            this.notificationService.showNotification('Autor eliminado exitosamente.');
            this.loadAuthors();
          }, 
          error: (e) => {
            console.error('Error deleting author:', e);
            this.notificationService.showNotification('Error al eliminar el autor.');
          }
        });
      }
    });
  }
}
