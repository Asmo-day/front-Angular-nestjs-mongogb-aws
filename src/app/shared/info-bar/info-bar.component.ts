import { Component, OnInit, effect, inject } from '@angular/core';
import { IInfoBar, InfoBarService } from './info-bar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-bar.component.html',
  styleUrl: './info-bar.component.scss'
})
export class InfoBarComponent {

  public infoBarService = inject(InfoBarService)

  constructor() {
    console.log(this.infoBarService.triggerInfoBar());
    effect(() =>{
      // setTimeout(() => {
        
        this.infoBarService.triggerInfoBar
      // }, 3000);
    })

  }

  dipslay(): string {
    return ` .overlay1 {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 300px;
      color: white;
      font-size: xx-large;
      background-color: rgba(0, 0, 0, 0.5);
    }`
  }



}
