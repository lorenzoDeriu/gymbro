import { FriendsComponent } from "./components/friends/friends.component";
import { PrebuildWorkoutComponent } from "./components/prebuild-workout/prebuild-workout.component";
import { TrainingProgramSelectorComponent } from "./components/training-program-selector/training-program-selector.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccessComponent } from "./components/access/access.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HomeComponent } from "./components/home/home.component";
import { NewWorkoutComponent } from "./components/new-workout/new-workout.component";
import { OldWorkoutsComponent } from "./components/old-workouts/old-workouts.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { TrainingProgramsComponent } from "./components/training-programs/training-programs.component";
import { YourProgressComponent } from "./components/your-progress/your-progress.component";
import { AuthGuard } from "./services/auth.guard";
import { TrainingProgramBuilderComponent } from "./components/training-program-builder/training-program-builder.component";
import { SearchResultComponent } from "./components/search-result/search-result.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AboutComponent } from "./components/about/about.component";
import { SettingsPageComponent } from "./components/settings-page/settings-page.component";
import { WelcomePageComponent } from "./components/welcome-page/welcome-page.component";
import { AdminGuard } from "./services/admin.guard";
import { AboutPreviewComponent } from "./components/about-preview/about-preview.component";

const routes: Routes = [
	{ path: "", redirectTo: "home", pathMatch: "full" },
	{ path: "welcome", component: WelcomePageComponent },
	{ path: "access", component: AccessComponent },
	{
		path: "home",
		component: HomeComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: "", redirectTo: "dashboard", pathMatch: "full" },
			{ path: "dashboard", component: DashboardComponent },
			{ path: "new-workout-choice", component: NewWorkoutComponent },
			{ path: "old-workouts", component: OldWorkoutsComponent },
			/* { path: "progress", component: YourProgressComponent }, */
			{
				path: "training-program-selector",
				component: TrainingProgramSelectorComponent,
			},
			{ path: "training-programs", component: TrainingProgramsComponent },
			{
				path: "training-program-builder",
				component: TrainingProgramBuilderComponent,
			},
			{ path: "prebuild-workout", component: PrebuildWorkoutComponent },
			{ path: "friends", component: FriendsComponent },
			{ path: "search-result", component: SearchResultComponent },
			{ path: "profile", component: ProfileComponent },
			{ path: "about", component: AboutComponent },
			{ path: "settings", component: SettingsPageComponent },
		],
	},
	{ path: "about-preview", component: AboutPreviewComponent },
	{
		path: "admin",
		component: AdminComponent,
		canActivate: [AdminGuard],
	},
	{ path: "**", component: PageNotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
