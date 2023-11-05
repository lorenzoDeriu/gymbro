import { Router } from "@angular/router";
import { Component } from "@angular/core";
@Component({
	selector: "app-new-workout",
	templateUrl: "./new-workout.component.html",
	styleUrls: ["./new-workout.component.css"],
})
export class NewWorkoutComponent {
	constructor(private router: Router) {}

	workoutExists() {
		return localStorage.getItem("workout") != null;
	}

	navigate(path: string) {
		this.router.navigate([path]);
	}
}
