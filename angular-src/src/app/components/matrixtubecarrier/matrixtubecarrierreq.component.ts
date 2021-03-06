/*
 * @Description: The matrix tube carrier request page
 * @Author: Guozhi Tang
 * @Date: 2019-08-15 16:13:19
 * @Github: https://github.com/GuozhiTang/Bio-WebApp
 * @LastEditors: Guozhi Tang
 * @LastEditTime: 2019-08-30 14:20:06
 */
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { requiredFileType } from './upload-file-validators';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AuthService } from '../../services/auth.service';
import { Workorder } from '../../../models/Workorder';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RemotereqService } from '../../services/remotereq.service';
import { Operator } from '../../../models/Operator';
import { Department } from '../../../models/Department';

@Component({
  selector: 'app-matrixtubecarrierreq',
  templateUrl: './matrixtubecarrierreq.component.html',
  styleUrls: ['./matrixtubecarrierreq.component.css']
})

export class MatrixtubecarrierreqComponent {
  operator: Operator;
  department: Department;
  departments: Department[];
  progress = 0;
  // control: FormControl;
  @ViewChild(FileUploadComponent) childUpload : FileUploadComponent;
  workorderids: BigInteger[];
  workorders: Workorder[];
  // workorderId: Workorder[];
  // user: {
  //   name: String;
  //   department: String;
  // };
  signup = new FormGroup({
    department: new FormControl(null, Validators.required),
    workorderid: new FormControl(null, Validators.required),
    csv: new FormControl(null, [Validators.required, requiredFileType('csv')])
  });
  checkSubmit: Boolean = false;

  constructor(
    public authService:AuthService,
    private flashMessage:FlashMessagesService,
    private remoteService: RemotereqService,
    ) {

      // Get operator information in local database
      this.authService.getProfile().subscribe(profile => {
        // console.log(profile);
        this.operator = profile.operator;
        // console.log(this.operator);

        // Get departments according to specific operator information
        var departments = [];
        var data = this.remoteService.getCoreDaoReqData('OperatorDept', ['id'], 'fireplex.data.backend.core', true);
        this.remoteService.retrievalData(data).subscribe(res => {
          // console.log(res.results);
          for (var i = 0; i < res.results.length; i++) {
            if (res.results[i].operator_id.id == profile.operator.id) {
              // console.log(res.results[i].dept_spec);
              departments.push(res.results[i].dept_spec);
            }
          }
          this.departments = departments;
          // console.log(this.departments);
        });
      });

      // Get the work-order id list here
      this.remoteService.retrievalData('fpAntibodyMatrixReq').subscribe(res => {
        this.workorderids = res.results;
      });
  }

  /**
   * First Submit -- In order to get the details of work-oder
   * Function to check the match results of details which will influence the active of second submit buttom
   * Only if all match results are true, the second submit buttom can become active, otherwise, it is disabled
   */
  onSubmit() {
    // console.log(this.childUpload.content);
    // console.log(this.signup.value.workorderid);
    const uploadMatrixTube = {
      request: "fpAntibodyMatrixCarrierDet",
      // requestId: this.workorderid,
      requestId: this.signup.value.workorderid,
      scannedData: this.childUpload.content
    }

    this.remoteService.remotePostReq(uploadMatrixTube).subscribe(res => {
      if (res) {
        this.workorders = res;
        // console.log(res);
        // console.log(this.workorders.antibodyName);

        // Set the default status as active
        this.checkSubmit = true;
        for (let workorder of this.workorders) {
          // console.log(workorder.match);
          if (workorder.match == false) {
            this.checkSubmit = false;
            this.flashMessage.show('Not Match Completely!', {cssClass: 'alert-danger', timeout: 5000});
            break;
          }
        }
      } else {
        this.flashMessage.show('Selection cannot be empty or error exists!', {cssClass: 'alert-danger', timeout: 5000});
      }
    });

    // Keep the second submit button as disable every time we get a new deatils table
    // this.checkSubmit = false;

    if ( !this.signup.valid ) {
      markAllAsDirty(this.signup);
      return;
    }
  }

  /**
   * Second Submit -- When submit button is active, submit to store data in the remote server
   */
  onSubmit2() {
    const storeMatrixTube = {
      request: "fpAntibodyMatrixCarrierReqData",
      // requestId: this.workorderid,
      requestId: this.signup.value.workorderid,
      scannedData: this.childUpload.content
    }
    
    this.remoteService.remotePostReq(storeMatrixTube).subscribe(res => {
      console.log(res.results);
      if (res.results == null || res.results.length == 0) {
        this.flashMessage.show("Stored Successfully!", {cssClass: 'alert-success', timeout: 5000});
        window.location.href = "/matrixtubecarrier";
      } else {
        this.flashMessage.show(res.results, {cssClass: 'alert-danger', timeout: 5000});
      }
    });
  }

  /**
   * Function to check the match results of details which will influence the active of second submit buttom
   * Only if all match results are true, the second submit buttom can become active, otherwise, it is disabled
   */
  // checkSubmitFunc() {
  //   // Set the default status as active
  //   this.checkSubmit = true;
  //   for (let workorder of this.workorders) {
  //     // console.log(workorder.match);
  //     if (workorder.match == false) {
  //       this.checkSubmit = false;
  //       this.flashMessage.show('Not Match Completely!', {cssClass: 'alert-danger', timeout: 5000});
  //       break;
  //     }
  //   }
  // }

  hasError( field: string, error: string ) {
    const control = this.signup.get(field);
    return control.dirty && control.hasError(error);
  }
}

export function markAllAsDirty( form: FormGroup ) {
  for ( const control of Object.keys(form.controls) ) {
    form.controls[control].markAsDirty();
  }
}