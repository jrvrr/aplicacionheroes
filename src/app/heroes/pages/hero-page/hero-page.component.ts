import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interfaces';
import { HeroesService } from '../../services/heroes.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-hero-page',
  standalone: false,
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private location: Location,
    private heroesService: HeroesService, 
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroById(id))
      )
      .subscribe(hero => {
        if (!hero) {
          this.router.navigate(['/heroes/list']);
          return;
        }
        this.hero = hero;
      });
  }

  editHero(): void {
    if (this.hero) {
      this.router.navigate(['/edit-hero', this.hero.id]);
    }
  }

  goBack(): void {
    this.location.back();
  }
  
}
