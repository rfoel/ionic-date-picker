import { BrowserModule } from "@angular/platform-browser"
import { ErrorHandler, NgModule } from "@angular/core"
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular"
import { SplashScreen } from "@ionic-native/splash-screen"
import { StatusBar } from "@ionic-native/status-bar"

import { DatePicker } from "../components/date-picker/date-picker"

import { MyApp } from "./app.component"

@NgModule({
  declarations: [MyApp, DatePicker],
  imports: [BrowserModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, DatePicker],
  providers: [StatusBar, SplashScreen, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule {}
