import { Component, OnInit, Input } from '@angular/core';
import { Plate } from '../../../../Plate';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-sourceplate',
  templateUrl: './sourceplate.component.html',
  styleUrls: ['./sourceplate.component.css']
})
export class SourceplateComponent implements OnInit {
  plates: Plate[];
  id: Number;
  barcode: Number;
  name: String;
  coor: String;
  volume: String;
  description: String;
  searchCoorRes: Plate[];
  emptyCoorRes: Plate[];
  results: object;
  text: String;
  // @Input() sourcebarcode: Number;
  // @Input() showSource : boolean = true;

  constructor(
    private dataService: DataService,
  ) {
    this.dataService.getData('Plate').subscribe(plates => {
      this.plates = plates;
    });
  }

  ngOnInit() {
  }

  onSearchPlatesByCoor(coor) {
    const searchData = {
      coor: coor
    }
    // this.plateService.searchPlatesByCoor(searchCoor).subscribe(res => {
    //   console.log(res);
    //   console.log(res[0].id);
    //   this.searchCoorRes = res;
    //   // console.log(typeof(this.searchCoorRes));
    // });
    this.dataService.searchData('Plate_coor', searchData).subscribe(res => {
      // console.log(typeof(res));
      if (res[0].volume != null && res[0] != "") {
        this.emptyCoorRes = undefined;
        this.searchCoorRes = res;
      } else {
        this.searchCoorRes = undefined;
        this.emptyCoorRes = res;
      }
    });
  }
}
