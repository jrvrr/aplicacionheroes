import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HeroesService } from '../../services/heroes.service';
import { Hero, Publisher } from '../../interfaces/hero.interfaces';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-page',
  standalone: false,
  
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superHero: new FormControl<string>(''),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  })

  public publishers = [
    {id: 'DC Comics', desc: 'DC - Comics'},
    {id: 'MARVEL Comics', desc: 'MARVEL - comics'}
  ];

  imagePreview: string | null = null; 
  
  constructor (
    private heroesService: HeroesService,
    private route: ActivatedRoute
  ){}

  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    const heroId = this.route.snapshot.paramMap.get('id');
    if (heroId) {
      this.heroesService.getHeroById(heroId).subscribe(hero => {
        if (!hero) return;
        this.heroForm.patchValue(hero);
        this.imagePreview = hero.alt_img || null;
      });
    }
  }  

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.heroForm.patchValue({ alt_img: this.imagePreview });
        console.log(this.imagePreview);
      };
      reader.readAsDataURL(file);
    }
  }
  
  editHero(hero: Hero): void {
    this.heroForm.patchValue(hero); // Carga los datos del héroe en el formulario
    this.imagePreview = hero.alt_img || null; // Muestra la imagen si tiene una
  }  

  onSubmit(): void{
    if(this.heroForm.invalid) return;

    if(this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
      .subscribe(hero =>{
        //aqui pueden agregar la logica extra, como mostrar una notificacion de exito
        return;
      })
    }

    this.heroesService.addHero(this.currentHero)
    .subscribe(hero =>{
      //aqui podria redirigir al usuario o mostrat un mensaje
    })
  }
}
