/*
 * @Description: The page to show the instruments data in data server and local database
 * @Author: Guozhi Tang
 * @Date: 2019-05-08 14:00:28
 * @Github: https://github.com/GuozhiTang/Bio-WebApp
 * @LastEditors: Guozhi Tang
 * @LastEditTime: 2019-08-30 15:17:44
 */
import { Component, OnInit } from '@angular/core';
import { Instrument } from '../../../models/Instrument';
import { InstrumentSpec } from '../../../models/InstrumentSpec';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RemotereqService } from '../../services/remotereq.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
})
export class InstrumentsComponent implements OnInit {
  instruments: Instrument[];
  remoteinstruments: Instrument[];
  className: String;
  moduleName: String;
  moduleName_condition: String;
  short: String;
  short_add: String;
  short_condition: String;
  spec_id: Object;
  spec_id_add: Object;
  id: Number;
  id_add: Number;
  searchmoduleNameRes: Instrument[];
  searchShortRes: Instrument[];
  searchIdRes: Instrument[];
  searchConRes: Instrument[];
  instrumentSpecs: InstrumentSpec[];
  instrumentSpec: InstrumentSpec[];
  warningMsg: String;
  checkExist: Boolean = true;
  module: String = 'fireplex.data.backend.core';

  constructor(
    private flashMessage: FlashMessagesService,
    private remoteService: RemotereqService,
    private dataService: DataService,
    ) {
      // show all instruments locally
      this.dataService.getData('Instrument').subscribe(instruments => {
        this.instruments = instruments;
        // console.log(this.instruments);
      });

      // show all instruments remotely
      this.remoteService.retrievalData('getAllInstruments').subscribe(remoteinstruments => {
        this.remoteinstruments = remoteinstruments;
        // console.log(this.remoteinstruments);
      });

      // const getInstrumentSpecs = {
      //   request: "fireplexCoreDaoRetrieval",
      //   coreDaoReqData: {
      //     attrName: "id",
      //     colNames: ["id"],
      //     coreDao: {
      //       id: null,
      //       className: "InstrumentSpec",
      //       moduleName: this.module
      //     },
      //     dataRange: {},
      //     loadAll: "true"
      //   }
      // }

      // Get InstrumentSpecs remotely
      var coreDaoReqData = this.remoteService.getCoreDaoReqData('InstrumentSpec', ['id'], this.module, 'true');
      this.remoteService.retrievalData(coreDaoReqData).subscribe(specs => {
        this.instrumentSpecs = specs.results;
        // console.log(this.instrumentSpecs);
      });
    }

  ngOnInit() {
  }

  /**
   * Drop the previous instruments collection
   * Pull newest instruments collection from data server to local database
   */
  onResetInstruments() {
    // console.log(this.instruments);
    // if (this.instruments.length == 0) {
    //   console.log('No data in instruments!');
    // } else {
    //   console.log('Data already in instruments!');
    // }
    this.dataService.resetData('Instrument').subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Reset Successfully!', {cssClass: 'alert-success', timeout: 3000});
        // console.log('Reset Successfully!');
        window.location.reload();
      } else {
        this.flashMessage.show('Reset Failed!', {cssClass: 'alert-danger', timeout: 3000});
        // console.log('Reset Failed!');
      }
    });
  }

  /**
   * Search Instruments by moduleName
   */
  onSearchInstrumentsBymoduleName() {
    const searchData = {
      moduleName: this.moduleName,
    }
    this.dataService.searchData('Instrument_moduleName', searchData).subscribe(res => {
      this.searchmoduleNameRes = res;
    });
  }

  /**
   * Search Instruments by short
   */
  onSearchInstrumentsByShort() {
    const searchData = {
      short: this.short
    }
    this.dataService.searchData('Instrument_short', searchData).subscribe(res => {
      this.searchShortRes = res;
    });
  }

  /**
   * Search Instruments by instrument_id
   */
  onSearchInstrumentsById() {
    const searchData = {
      id: this.id
    }
    this.dataService.searchData('Instrument_id', searchData).subscribe(res => {
      this.searchIdRes = res;
    });
  }

  /**
   * Search Instrumenbrts by both moduleName and short
   */
  onSearchInstrumentsByConditions() {
    const searchData = {
      moduleName: this.moduleName_condition,
      short: this.short_condition
    }
    this.dataService.searchData('Instrument_conditions', searchData).subscribe(res => {
      this.searchConRes = res;
    });
  }

  /**
   * Create new Instrument both locally and remotely
   */
  onCreateInstrument() {
    // const remoteCreate = {
    //   request: "fireplexCoreDaoCreation",
    //   coreDaoReqData: {
    //     coreDao: {
    //       moduleName: "fireplex.data.backend.core",
    //       short: this.short_add,
    //       className: "Instrument",
    //       spec_id: this.spec_id_add,
    //       id: null
    //     },
    //     pKey: "id",
    //     searchKey: "short"
    //   }
    // }
    const coreDao = {
      moduleName: this.module,
      short: this.short_add,
      className: "Instrument",
      spec_id: this.spec_id_add,
      id: null
    }
    const Obj = this;
    this.remoteService.createData(coreDao, 'id', 'short').subscribe(res => {
      // console.log(res);
      var newid = res.results[0].id;
      // console.log(newid);
      // const localCreate = {
      //   moduleName: "fireplex.data.backend.core",
      //   short: this.short_add,
      //   className: "Instrument",
      //   spec_id: this.spec_id_add,
      //   id: newid
      // }
      coreDao.id = newid;
      Obj.dataService.addData('Instrument', coreDao).subscribe(data => {
        if (data.success) {
          Obj.flashMessage.show('Create New Role Successfully!', {cssClass: 'alert-success', timeout: 3000});
          window.location.reload();
        } else {
          Obj.flashMessage.show('Create Role Failed!', {cssClass: 'alert-danger', timeout: 3000});
        }
      });
    });
  }

  /**
   * Search by short name in order to check if it is existed in the local database
   * @param short short name of the instrument which will be created
   */
  onSearchByShort(short) {
    const searchData = {
      short: short,
    }
    this.dataService.searchData('Instrument_short', searchData).subscribe(res => {
      // console.log(res[0]);
      if (res[0]) {
        this.warningMsg = 'Role already exists in database!';
        this.checkExist = true;
      } else {
        this.warningMsg = undefined;
        this.checkExist = false;
      }
    });
  }
}