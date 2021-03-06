import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { MediaPlayerComponent } from '../components/media-player/media-player.component';
import { SerieService } from '../services/serie.service';
import { ParamsService } from '../services/params.service';
import { TreeComponent } from '../components/tree/tree.component';
import { DisplayFolderComponent } from '../components/display-folder/display-folder.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    MediaPlayerComponent,
    TreeComponent,
    DisplayFolderComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [SerieService, ParamsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
