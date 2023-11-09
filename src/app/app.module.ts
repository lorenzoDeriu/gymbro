import { environment } from "src/environments/environment";
import { NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AccessComponent } from "./components/access/access.component";

import { HttpClientModule } from "@angular/common/http";

import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { HomeComponent } from "./components/home/home.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { MatGridListModule } from "@angular/material/grid-list";
import {
	MatRippleModule,
	MAT_DATE_LOCALE,
	DateAdapter,
} from "@angular/material/core";
import { NewWorkoutComponent } from "./components/new-workout/new-workout.component";
import { OldWorkoutsComponent } from "./components/old-workouts/old-workouts.component";
import { YourProgressComponent } from "./components/your-progress/your-progress.component";
import { TrainingProgramsComponent } from "./components/training-programs/training-programs.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { TrainingProgramSelectorComponent } from "./components/training-program-selector/training-program-selector.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { NewExerciseDialogComponent } from "./components/new-exercise-dialog/new-exercise-dialog.component";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSliderModule } from "@angular/material/slider";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { provideFirebaseApp, getApp, initializeApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { MatTableModule } from "@angular/material/table";
import { TrainingProgramBuilderComponent } from "./components/training-program-builder/training-program-builder.component";
import { PrebuildWorkoutComponent } from "./components/prebuild-workout/prebuild-workout.component";
import { MatDividerModule } from "@angular/material/divider";
import { PasswordRecoverDialogComponent } from "./components/password-recover-dialog/password-recover-dialog.component";
import { ExercisePickerDialogComponent } from "./components/exercise-picker-dialog/exercise-picker-dialog.component";
import { FriendsComponent } from "./components/friends/friends.component";
import { SearchResultComponent } from "./components/search-result/search-result.component";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { ProfileComponent } from "./components/profile/profile.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FeedbackDialogComponent } from "./components/feedback-dialog/feedback-dialog.component";
import { AdminComponent } from "./components/admin/admin.component";
import { FeedbackListComponent } from "./components/feedback-list/feedback-list.component";
import { AddExerciseDialogComponent } from "./components/add-exercise-dialog/add-exercise-dialog.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { AboutComponent } from "./components/about/about.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SettingsPageComponent } from "./components/settings-page/settings-page.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ExerciseStatsComponent } from "./components/exercise-stats/exercise-stats.component";
import { NotesDialogComponent } from "./components/notes-dialog/notes-dialog.component";
import { ExerciseStatsDialogComponent } from "./components/exercise-stats-dialog/exercise-stats-dialog.component";
import { WelcomePageComponent } from "./components/welcome-page/welcome-page.component";
import { CustomDateAdapter } from "./components/prebuild-workout/date-picker-adapter";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SafetyActionConfirmDialogComponent } from "./components/safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { ErrorLoginDialogComponent } from "./components/error-login-dialog/error-login-dialog.component";
import { ErrorRegisterDialogComponent } from "./components/error-register-dialog/error-register-dialog.component";
import { ErrorProviderDialogComponent } from "./components/error-provider-dialog/error-provider-dialog.component";
import { NewWorkoutDialogComponent } from "./components/new-workout-dialog/new-workout-dialog.component";
import { CustomExcerciseDialogComponent } from "./components/custom-excercise-dialog/custom-excercise-dialog.component";
import { ShareDialogComponent } from "./components/share-dialog/share-dialog.component";
import { AdminDialogComponent } from './components/admin-dialog/admin-dialog.component';

@NgModule({
	declarations: [
		AppComponent,
		AccessComponent,
		HomeComponent,
		PageNotFoundComponent,
		NewWorkoutComponent,
		OldWorkoutsComponent,
		YourProgressComponent,
		TrainingProgramsComponent,
		DashboardComponent,
		TrainingProgramSelectorComponent,
		NewExerciseDialogComponent,
		TrainingProgramBuilderComponent,
		PrebuildWorkoutComponent,
		PasswordRecoverDialogComponent,
		ExercisePickerDialogComponent,
		FriendsComponent,
		SearchResultComponent,
		ProfileComponent,
		FeedbackDialogComponent,
		AdminComponent,
		FeedbackListComponent,
		AddExerciseDialogComponent,
		AboutComponent,
		SettingsPageComponent,
		ExerciseStatsComponent,
		NotesDialogComponent,
		ExerciseStatsDialogComponent,
		WelcomePageComponent,
		SafetyActionConfirmDialogComponent,
		ErrorLoginDialogComponent,
		ErrorRegisterDialogComponent,
		ErrorProviderDialogComponent,
		NewWorkoutDialogComponent,
		CustomExcerciseDialogComponent,
		ShareDialogComponent,
  AdminDialogComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatTabsModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		FormsModule,
		MatInputModule,
		MatButtonModule,
		HttpClientModule,
		MatToolbarModule,
		MatIconModule,
		MatGridListModule,
		MatRippleModule,
		MatExpansionModule,
		MatDialogModule,
		MatAutocompleteModule,
		MatSliderModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
		provideFirestore(() => getFirestore()),
		MatTableModule,
		MatDividerModule,
		MatCardModule,
		MatProgressBarModule,
		MatSnackBarModule,
		ServiceWorkerModule.register("ngsw-worker.js", {
			enabled: !isDevMode(),
			registrationStrategy: "registerWhenStable:1000",
		}),
		MatTooltipModule,
		MatSlideToggleModule,
		NgbModule,
	],
	providers: [
		MatNativeDateModule,
		{ provide: MAT_DATE_LOCALE, useValue: "en-GB" },
		{ provide: DateAdapter, useClass: CustomDateAdapter },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
