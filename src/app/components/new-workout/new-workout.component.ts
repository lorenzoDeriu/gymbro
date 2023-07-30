import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";

@Component({
	selector: "app-new-workout",
	templateUrl: "./new-workout.component.html",
	styleUrls: ["./new-workout.component.css"],
})
export class NewWorkoutComponent {
	constructor(private router: Router, private userService: UserService) {}

	workoutExists() {
		return localStorage.getItem("workout") != null;
	}

	navigate(path: string) {
		this.router.navigate([path]);
	}
}
