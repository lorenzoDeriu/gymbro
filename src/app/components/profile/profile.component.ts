import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FirebaseService } from "src/app/services/firebase.service";
import { UserService } from "src/app/services/user.service";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit, OnDestroy {
	public username: string;
	public trainingPrograms: any[];

	public loading: boolean;
	displayedColumns: string[] = [
		"Esercizio",
		"Serie x Ripetizioni",
		"Recupero",
		"RPE",
	];

	constructor(
		private firebase: FirebaseService,
		private userService: UserService,
		private snackBar: MatSnackBar
	) {}

	async ngOnInit() {
		this.loading = true;

		try {
			let uid: string = JSON.parse(localStorage.getItem("profile"))[
				"uid"
			];
			localStorage.removeItem("profile");

			this.trainingPrograms =
				await this.firebase.getTrainingProgramsFromUser(uid);
			this.username = await this.firebase.getUsername(uid);

			if (this.trainingPrograms == undefined) this.trainingPrograms = [];
		} catch {
			this.trainingPrograms = JSON.parse(
				localStorage.getItem("profileInfo")
			)["trainingPrograms"];
			this.username = JSON.parse(localStorage.getItem("profileInfo"))[
				"username"
			];
		} finally {
			localStorage.setItem(
				"profileInfo",
				JSON.stringify({
					trainingPrograms: this.trainingPrograms,
					username: this.username,
				})
			);
		}

		this.loading = false;
	}

	ngOnDestroy(): void {
		localStorage.removeItem("profileInfo");
	}

	saveWorkout(trainingProgramIndex: number) {
		this.firebase.addTrainingProgram(
			this.trainingPrograms[trainingProgramIndex]
		);
		this.snackBar.open("Scheda salvata!", "Ok", { duration: 3000 });
	}
}
