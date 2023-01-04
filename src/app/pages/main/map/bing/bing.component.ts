import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BingMapLoaderService} from '../service/bing-map-loader.service';

@Component({
  selector: 'app-bing',
  templateUrl: './bing.component.html',
  styleUrls: ['./bing.component.scss'],
  providers: [BingMapLoaderService]
})
export class BingComponent implements OnInit, AfterViewInit {

  bingMap: any; // 地图实体

  constructor(private bingMapLoader: BingMapLoaderService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.bingMapLoader.load().then(() => {
      this.bingMap = new Microsoft.Maps.Map(document.getElementById('bingMap'), {
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        zoom: 14
      });
      this.bingMap.getCenter();
    });
  }

}
