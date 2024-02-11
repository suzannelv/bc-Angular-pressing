import { Component } from '@angular/core';

@Component({
  selector: 'app-prestations',
  templateUrl: './prestations.component.html',
  styleUrl: './prestations.component.css',
})
export class PrestationsComponent {
  serviceList = [
    { imgUrl: 'assets/home/blanchiment.svg', name: 'Blanchiment' },
    { imgUrl: 'assets/home/net-sec.svg', name: 'Nettoyage à sec' },
    { imgUrl: 'assets/home/pressing.svg', name: 'Pressing' },
    { imgUrl: 'assets/home/repassage.svg', name: 'Repassage' },
    { imgUrl: 'assets/home/stains.svg', name: 'Détachage' },
    { imgUrl: 'assets/home/retouche.svg', name: 'Retouche' },
  ];
}
