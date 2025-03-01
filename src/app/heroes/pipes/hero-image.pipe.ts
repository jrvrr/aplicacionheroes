import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interfaces';

@Pipe({
  name: 'heroImage',
  standalone: false
})
export class HeroImagePipe implements PipeTransform {
  //Método que se ejecuta al usar el pipe en una plantilla, recibe un objeto Hero y lo devuelve
  // una  URL de imagen

  transform(hero: Hero): string {

    if (!hero.id && !hero.alt_img) {
      return 'assets/images/no-image.png'; 
      // Si el héroe no tiene un ID ni imagen alternativa, devuelve la imagen por defecto
    }
  
    if (hero.alt_img) {
      return hero.alt_img; 
      // Si el héroe tiene una imagen alternativa (alt_img), usa esa URL directamente
    }
  
    return `assets/images/heroes/${hero.id}.jpg`; 
    // Si el héroe tiene un ID, genera la URL de la imagen usando su ID

}
}
