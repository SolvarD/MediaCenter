import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaCenterConfig } from '../../models/media-center-config';
import { ParamsService } from '../../services/params.service';
import { FormBuilder, Validators, FormGroup, AbstractControl, AsyncValidator, AsyncValidatorFn, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  config: MediaCenterConfig;
  routeForms: FormGroup[] = [];

  constructor(private paramsService: ParamsService, private _fb: FormBuilder, private ref: ChangeDetectorRef) { }

  async ngOnInit() {
    this.config = await this.paramsService.getConfig();
    this.config.videoLocation.forEach((route) => {
      this.routeForms.push(this.formBuilder(route));
    })
    this.ref.detectChanges();
  }

  formBuilder(route?: string) {
    return this._fb.group({
      route: [(route ? route : ''), this.pathValidator]
    })
  }

  addRoute() {
    this.routeForms.push(this.formBuilder());
  }

  async save() {
    //this.routeForms.forEach(g => g.updateValueAndValidity());
    let routes = this.routeForms.map(g => g.value.route) as string[];
    //for (var i = 0; i < routes.length; i++) {
    //  console.log(await this.paramsService.checkPath(routes[i]))
    //}

    console.log(routes);
    console.log(this.routeForms);
    //this.config.videoLocation = routes;
  }

  pathValidator = (control: AbstractControl): ValidatorFn => {
    console.log(control);

    return async (control: AbstractControl) => {
      let pathExist = await this.paramsService.checkPath(control.value);
      console.log(pathExist);
      return pathExist;
    }
    
  }
}
