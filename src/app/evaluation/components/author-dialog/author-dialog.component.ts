import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../interfaces/author.model';
import { NotificationService } from '../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';

export interface gender {
  id: string,
  label: string,
}

@Component({
  selector: 'app-author-dialog',
  templateUrl: './author-dialog.component.html',
  styleUrls: ['./author-dialog.component.scss']
})
export class AuthorDialogComponent {
  authorForm: FormGroup;
  isEditMode: boolean = false;
  private unsubscribe$ = new Subject<void>();

  genders: gender[] = [
    {
        id: 'female',
        label: 'femenino',
    }, {
        id: 'male',
        label: 'masculino',
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<AuthorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.authorForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.author) {
      this.isEditMode = true;
      this.authorForm.patchValue(this.data.author);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(): void {
    if (this.authorForm.valid) {
      if (this.isEditMode) {
        this.authorService.updateAuthor(this.authorForm.value)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: () => {
              this.notificationService.showNotification('Autor actualizado exitosamente.');
              this.dialogRef.close('saved');
            },
            error: (e) => {
                console.error('Error updating author:', e);
                this.notificationService.showNotification('Error al actualizar el autor.');
            }
          });
      } else {
        const newAuthor: Author = {
          ...this.authorForm.value,
          id: undefined
        };
        this.authorService.addAuthor(newAuthor)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: () => {
              this.notificationService.showNotification('Autor registrado exitosamente.');
              this.dialogRef.close('saved');
            }, 
            error: (e) => {
              console.error('Error registering author:', e);
              this.notificationService.showNotification('Error al registrar el autor.');
            }
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  
}
