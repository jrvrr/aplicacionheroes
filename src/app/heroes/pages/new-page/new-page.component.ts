import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroesService } from '../../services/heroes.service';
import { Hero, Publisher } from '../../interfaces/hero.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-new-page',
  standalone: false,
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', Validators.required),
    publisher: new FormControl<Publisher>(Publisher.DCComics, Validators.required),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'MARVEL Comics', desc: 'MARVEL - Comics' }
  ];

  imagePreview: string | null = 'assets/usuario.png';
  private heroId: string | null = null; 

  constructor(
    private heroesService: HeroesService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la URL
    this.heroId = this.route.snapshot.paramMap.get('id');

    if (this.heroId) {
      this.loadHeroData(this.heroId);
    }
  }

  // Cargar los datos del héroe desde el servicio
  private loadHeroData(id: string): void {
    this.heroesService.getHeroById(id).subscribe(hero => {
      if (hero) {
        this.heroForm.patchValue(hero);
        // Asignar la imagen por defecto o la que viene en el héroe
        this.imagePreview = hero.alt_img ? hero.alt_img : 'assets/default-hero.jpg';
      }
    });
  }

  // Manejo de imágenes
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.heroForm.patchValue({ alt_img: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  // Obtener el héroe actual
  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  // Guardar cambios o crear nuevo héroe
  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      // Si el héroe tiene ID, actualizarlo
      this.heroesService.updateHero(this.currentHero).subscribe(hero => {
        console.log('Héroe actualizado:', hero);
        this.snackbar.open('Héroe actualizado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/heroes']); // Redirigir después de editar
      });
    } else {
      // Si no tiene ID, crearlo
      this.heroesService.addHero(this.currentHero).subscribe(hero => {
        console.log('Héroe creado:', hero);
        this.snackbar.open('Héroe creado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/heroes']); // Redirigir después de crear
      });
    }
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero is required');
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.currentHero
    });
  
    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(() => {
        this.router.navigate(['/heroes']);
        this.snackbar.open('Héroe borrado', 'Cerrar', { duration: 3000 });
      });
  }

}
