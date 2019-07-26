import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RemotereqService } from '../../services/remotereq.service';

@Component({
  selector: 'app-generateworkorder',
  templateUrl: './generateworkorder.component.html',
  styleUrls: ['./generateworkorder.component.css']
})
export class GenerateworkorderComponent implements OnInit {
  deptSpecId: number;
  employeeId: number;
  opSpecNames: String[] = ['Assay Request', 'Code Dilution Request', 'Code Mix Request', 'Particle Coding Request', 'Transfer Request'];
  opSpecName: String;
  assayCodeTypes: String[];
  assayCodeType: String;
  assayCodeId1s: number[];
  assayCodeId2s: number[];
  UC21A: number = 41.2;
  UC2NF: number = 30.3;
  UC31A: number = 41.478;
  UC3NF: number = 30.675;
  Volume: number = 500;
  Maxlin1: number = 0.50;
  Maxlin2: number = 1.45;
  Minlin: number = 0.046;
  MAX1: number = 0.5;
  MAX2: number = 1.45;
  MIN: number = 0.042;
  UC2: number = 1.269776;
  UC3: number = 1.405181;
  Grid: number[] = [1,2,3,4,5,6,7,8,9,10,
                    1,2,3,4,5,6,7];
  percentages: number[];
  tableCode1: number[];
  tableCode2: number[];
  check10x7: Boolean = false;
  check4x4: Boolean = true;
  check6x6: Boolean = true; 

  constructor(
    private flashMessage:FlashMessagesService,
    private remoteService: RemotereqService,
  ) {
    // Get the set of Code1 IDs
    var codeId1s = [];
    this.remoteService.retrievalData('fpGetSingleCode1').subscribe(res => {
      // console.log(res);
      for (var i = 0; i < res.length; i++) {
        codeId1s.unshift(res[i].id);
      }
      this.assayCodeId1s = codeId1s;
    });

    // Get the set of Code2 IDs
    var codeId2s = [];
    this.remoteService.retrievalData('fpGetSingleCode2').subscribe(res => {
      // console.log(res);
      for (var i = 0; i < res.length; i++) {
        codeId2s.unshift(res[i].id);
      }
      this.assayCodeId2s = codeId2s;
    });
  }

  ngOnInit() {
  }

  getCodeMapType(codeMap) {
    if (codeMap == '4x4') {
      console.log('Code Map Type is 4x4!');
      this.check4x4 = true;
      this.check6x6 = false;
      this.check10x7 = false;
    } else if (codeMap == '6x6') {
      console.log('Code Map Type is 6x6!');
      this.check4x4 = false;
      this.check6x6 = true;
      this.check10x7 = false;
    } else if (codeMap == '10x7'){
      console.log('Code Map Type is 10x7!')
      this.check4x4 = false;
      this.check6x6 = false;
      this.check10x7 = true;
    } else {
      this.check4x4 = false;
      this.check6x6 = false;
      this.check10x7 = false;
    }
  }

  /**
   * Get Assay Code Types according to selected request type
   * @param reqType: Input selected request type
   */
  getAssayCodeType(reqType) {
    if (reqType == 'Assay Request') {
      this.assayCodeTypes = ['Assay Req Elem'];
    } else if (reqType == 'Particle Coding Request') {
      this.assayCodeTypes = ['Particle Req Elem'];
    } else if (reqType == 'Code Mix Request' || reqType == 'Code Dilution Request') {
      this.assayCodeTypes = ['CEA Code Req Elem', 'miRNA Code Req Elem'];
    }
  }

  /**
   * Do the calculation according to four inputs from user
   * Then give a display for the calculated data
   * Creation of request is allowed only after this calculation
   */
  onCalculate() {
    if (this.check4x4) this.calculate4x4();
    else if (this.check6x6) this.calculate6x6();
    else if (this.check10x7) this.calculate10x7();
  }

  calculate4x4() {}

  calculate6x6() {}

  calculate10x7() {
    var H9 = this.UC21A * 1000 / 4023.9;
    var I9 = this.UC2NF * 1000 / 3370.2;
    var J9 = this.UC31A * 1000 / 4103.9;
    var K9 = this.UC3NF * 1000 / 3450.2;
    var spacing1 = (Math.log10(this.Maxlin1) - Math.log10(this.Minlin)) / 9;
    var spacing2 = (Math.log10(this.Maxlin2) - Math.log10(this.Minlin)) / 6;
    var percent = ADJ / (1 + ADJ);
    var ADJ;
    var FNF;
    var position;
    var percentRes = [];
    var Cy3Array = [];
    var NFArray = [];

    for (var i = 0; i < this.Grid.length; i++) {
      if (i == 0) {
        percentRes[i] = 100.0;
        continue;
      }
      if (i == 10) {
        percentRes[i] = 100.0;
        continue;
      }
      if (i < 10) {
        position = Math.pow(10, Math.log10(this.Maxlin1) - i * spacing1);
        FNF = (position - this.MIN) / (this.UC2 * (this.MAX1 - position));
        ADJ = FNF * I9 / H9;
      } else if (i > 10) {
        position = Math.pow(10, Math.log10(this.Maxlin2) - (i - 10) * spacing2);
        FNF = (position - this.MIN) / (this.UC3 * (this.MAX2 - position));
        ADJ = FNF * K9 / J9;
      }
      percent = ADJ / (1 + ADJ);
      percentRes[i] = (percent * 100).toFixed(4);
    }
    // console.log(percentRes);
    this.percentages = percentRes;
    // console.log(this.percentages);

    for (var j = 0; j < percentRes.length; j++) {
      Cy3Array[j] = ((percentRes[j] / 100) * this.Volume).toFixed(2);
      NFArray[j] = (this.Volume - Cy3Array[j]).toFixed(2);
    }
    // console.log(Cy3Array);
    // console.log(NFArray);

    var tableData1 = [];
    var tableData2 = [];

    for (var i = 0; i < 10; i++) {
      var Data1 = {
        code1Num: i + 1,
        Cy3: Cy3Array[i],
        NF: NFArray[i]
      }
      tableData1.push(Data1);
    }
    this.tableCode1 = tableData1;
    // console.log(this.tableCode1);

    for (var j = 10; j < 17; j++) {
      var Data2 = {
        code1Num: j - 9,
        Cy3: Cy3Array[j],
        NF: NFArray[j]
      }
      tableData2.push(Data2);
    }
    this.tableCode2 = tableData2;
    // console.log(this.tableCode2);
  }

  /**
   * A submit functionality to generate a request
   */
  onCreateReq() {
    // console.log(this.assayCodeId1s);
    // console.log(this.assayCodeId2s);
    const roleName = (this.opSpecName == 'Code Mix Request') ? 'Code Mixes' : 'Code Dils';
    const localAssayCodeType = this.assayCodeType;
    // Define the parentOptions
    var parentOptions = {
      roleName: roleName,
      units: "",
      value: 1,
      ordNum: 0,
      reqElemSpecName: this.assayCodeType,
    }

    // Define and get the subReqOptions
    var subReqOptions = [];
    const percentageArray = this.percentages;
    // Add Code1 IDs to the subReqOptions
    this.assayCodeId1s.forEach(function(val, index) {
      // console.log(index, val);
      const subReqData = {
        value: percentageArray[index],
        units: "",
        ordNum: index,
        assayCodeId: val,
        codeReqElemSpecName: localAssayCodeType,
        roleName: "UC1-Bodipy",
        reqElemSpecName: localAssayCodeType,
      }
      subReqOptions.push(subReqData);
    });

    // Add Code2 IDs to the subReqOptions
    this.assayCodeId2s.forEach(function(val, index) {
      const subReqData = {
        value: percentageArray[index + 10],
        units: "",
        ordNum: index + 10,
        assayCodeId: val,
        codeReqElemSpecName: localAssayCodeType,
        roleName: "HB",
        reqElemSpecName: localAssayCodeType,
      }
      subReqOptions.push(subReqData);
    });
    // console.log(subReqOptions);

    // Define the json set to sent in order to generate the request
    const generateRequest = {
      request: "generateRequest",
      deptSpecId: 2867745,
      employeeId: 1587869,
      opSpecName: this.opSpecName,
      parentOptions: parentOptions,
      subReqOptions: {"subReqOptionsList": subReqOptions},
    }
    // console.log(generate);

    this.remoteService.remotePostReq(generateRequest).subscribe(res => {
      console.log(res);
      if (res) {
        this.flashMessage.show('Create Work-order Successfully!', {cssClass: 'alert-success', timeout: 5000});
        window.location.reload();
      } else {
        this.flashMessage.show('Error Exists! Check again!');
      }
    });
  }
}