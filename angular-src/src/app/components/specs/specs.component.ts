/*
 * @Description: To show the specs data in data server and local database but it is the test version for functions communicating with data server. It is not used for now.
 * @Author: Guozhi Tang
 * @Date: 2019-04-09 14:00:28
 * @Github: https://github.com/GuozhiTang/Bio-WebApp
 * @LastEditors: Guozhi Tang
 * @LastEditTime: 2019-08-30 15:21:23
 */
import { Component, OnInit } from '@angular/core';
import { Spec } from '../../../models/Spec';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RemotereqService } from '../../services/remotereq.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-specs',
  templateUrl: './specs.component.html',
  styleUrls: ['./specs.component.css']
})
export class SpecsComponent implements OnInit {
  specs: Spec[];
  remotespecs: Spec[];
  className: String;
  moduleName: String;
  description: String;
  name: String;
  id: String;
  searchName: String;
  searchNameRes: Spec[];
  searchModuleNameRes: Spec[];
  searchIdRes: Spec[];
  searchConRes: Spec[];

  constructor(
    private flashMessage: FlashMessagesService,
    private remoteService: RemotereqService,
    private dataService: DataService,
    ) {
      // show all specs locally
      this.dataService.getData('Spec').subscribe(specs => {
        this.specs = specs;
      });

      // show all specs remotely
      this.remoteService.retrievalData('getSpecs').subscribe(remotespecs => {
        this.remotespecs = remotespecs;
      });
    }

  ngOnInit() {
  }

  /**
   * Method of adding a new spec to the database
   */
  onAddSpecs() {
    const addData = {
      className: this.className,
      moduleName: this.moduleName,
      description: this.description,
      name: this.name,
      id: this.id
    }

    // Add Spec
    this.dataService.addData('Spec', addData).subscribe(data => {
      if (data.success) {
        console.log('Add Successfully!');
      } else {
        console.log('Add Failed!');
      }
    });
  }

  /**
   * Drop the previous spec collection
   * Pull newest specs collection from data server to local database
   */
  onResetSpecs() {
    this.dataService.resetData('Spec').subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Reset Successfully!', {cssClass: 'alert-success', timeout: 3000});
        // console.log('Reset Successfully!');
      } else {
        this.flashMessage.show('Reset Failed!', {cssClass: 'alert-danger', timeout: 3000});
        // console.log('Reset Failed!');
      }
    });
  }

  /**
   * Search specs by name
   */
  onSearchSpecsByName() {
    const searchData = {
      name: this.name
    }
    this.dataService.searchData('Spec_name', searchData).subscribe(res => {
      this.searchNameRes = res;
    });
  }

  /**
   * Search specs by moduleName
   */
  onSearchSpecsByModuleName() {
    const searchData = {
      moduleName: this.moduleName
    }
    this.dataService.searchData('Spec_moduleName', searchData).subscribe(res => {
      this.searchModuleNameRes = res;
    });
  }

  /**
   * Search specs by id
   */
  onSearchSpecsById() {
    const searchData = {
      id: this.id
    }
    this.dataService.searchData('Spec_id', searchData).subscribe(res => {
      this.searchIdRes = res;
    });
  }

  /**
   * Search specs by conditions
   */
  onSearchSpecsByConditions() {
    const searchData = {
      name: this.name,
      moduleName: this.moduleName
    }
    this.dataService.searchData('Spec_conditions', searchData).subscribe(res => {
      this.searchConRes = res;
    });
  }
}