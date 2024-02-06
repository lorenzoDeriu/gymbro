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
import { MatRippleModule } from "@angular/material/core";
import { OldWorkoutsComponent } from "./components/old-workouts/old-workouts.component";
import { TrainingProgramsComponent } from "./components/training-programs/training-programs.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { TrainingProgramSelectorComponent } from "./components/training-program-selector/training-program-selector.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { NewExerciseDialogComponent } from "./components/new-exercise-dialog/new-exercise-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSliderModule } from "@angular/material/slider";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { MatTableModule } from "@angular/material/table";
import { TrainingProgramBuilderComponent } from "./components/training-program-builder/training-program-builder.component";
import { PrebuildWorkoutComponent } from "./components/prebuild-workout/prebuild-workout.component";
import { MatDividerModule } from "@angular/material/divider";
import { PasswordRecoverDialogComponent } from "./components/password-recover-dialog/password-recover-dialog.component";
import { FriendsComponent } from "./components/friends/friends.component";
import { SearchResultComponent } from "./components/search-result/search-result.component";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { ProfileComponent } from "./components/profile/profile.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FeedbackDialogComponent } from "./components/feedback-dialog/feedback-dialog.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AddExerciseDialogComponent } from "./components/add-exercise-dialog/add-exercise-dialog.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { AboutComponent } from "./components/about/about.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SettingsPageComponent } from "./components/settings-page/settings-page.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NotesDialogComponent } from "./components/notes-dialog/notes-dialog.component";
import { ExerciseStatsDialogComponent } from "./components/exercise-stats-dialog/exercise-stats-dialog.component";
import { WelcomePageComponent } from "./components/welcome-page/welcome-page.component";
import { SafetyActionConfirmDialogComponent } from "./components/safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { CustomExcerciseDialogComponent } from "./components/custom-excercise-dialog/custom-excercise-dialog.component";
import { ShareDialogComponent } from "./components/share-dialog/share-dialog.component";
import { AdminDialogComponent } from "./components/admin-dialog/admin-dialog.component";
import { AboutPreviewComponent } from "./components/about-preview/about-preview.component";
import { WelcomeDialogComponent } from "./components/welcome-dialog/welcome-dialog.component";
import { EditProfilePicDialogComponent } from "./components/edit-profile-pic-dialog/edit-profile-pic-dialog.component";
import { ExpandFeedbackDialogComponent } from "./components/expand-feedback-dialog/expand-feedback-dialog.component";
import { ExpandExercisesDialogComponent } from "./components/expand-exercises-dialog/expand-exercises-dialog.component";
import { ShowExerciseFromTemplateDialogComponent } from "./components/show-exercise-from-template-dialog/show-exercise-from-template-dialog.component";
import { WorkoutNotSavedDialogComponent } from "./components/workout-not-saved-dialog/workout-not-saved-dialog.component";
import { DeloadDialogComponent } from "./components/deload-dialog/deload-dialog.component";
import { UpdateNotesDialogComponent } from "./components/update-notes-dialog/update-notes-dialog.component";

@NgModule({
	declarations: [
		AppComponent,
		AccessComponent,
		HomeComponent,
		PageNotFoundComponent,
		OldWorkoutsComponent,
		TrainingProgramsComponent,
		DashboardComponent,
		TrainingProgramSelectorComponent,
		NewExerciseDialogComponent,
		TrainingProgramBuilderComponent,
		PrebuildWorkoutComponent,
		PasswordRecoverDialogComponent,
		FriendsComponent,
		SearchResultComponent,
		ProfileComponent,
		FeedbackDialogComponent,
		AdminComponent,
		AddExerciseDialogComponent,
		AboutComponent,
		SettingsPageComponent,
		NotesDialogComponent,
		ExerciseStatsDialogComponent,
		WelcomePageComponent,
		SafetyActionConfirmDialogComponent,
		CustomExcerciseDialogComponent,
		ShareDialogComponent,
		AdminDialogComponent,
		AboutPreviewComponent,
		WelcomeDialogComponent,
		EditProfilePicDialogComponent,
		ExpandFeedbackDialogComponent,
		ExpandExercisesDialogComponent,
		ShowExerciseFromTemplateDialogComponent,
		WorkoutNotSavedDialogComponent,
		DeloadDialogComponent,
		UpdateNotesDialogComponent,
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
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
