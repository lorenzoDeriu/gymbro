import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FirebaseService } from "src/app/services/firebase.service";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { Router } from "@angular/router";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit, OnDestroy {
	/* public username: string;
	public trainingPrograms: any[]; */
	username: string = "Mario";
	trainingPrograms: any[] = [
		{
			name: "Scheda di Lorenzo",
			session: [
				{
					name: "PUSH",
					exercises: [
						{
							configurationType: 'advanced',
							name: "Panca piana",
							series: 2,
							range: [],
							RPE: "8",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {
								sets: [
									{
										min: 6,
										max: 8
									}
								]
							}
						},
						{
							configurationType: 'advanced',
							name: "Curl DB",
							series: 4,
							range: [],
							RPE: "9",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {
								sets: [
									{
										min: 6,
										max: 8
									}
								]
							}
						},
						{
							configurationType: 'basic',
							name: "Alzate laterali",
							series: 4,
							range: [8, 10],
							RPE: "9",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {}
						},
					],
				},
				{
					name: "PULL",
					exercises: [
						{
							configurationType: 'basic',
							name: "LAT Machine",
							series: 3,
							range: [10, 12],
							RPE: "8",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {}
						},
						{
							configurationType: 'advanced',
							name: "Curl DB",
							series: 4,
							range: [],
							RPE: "9",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {
								sets: [
									{
										min: 6,
										max: 8
									}
								]
							}
						},
						{
							configurationType: 'basic',
							name: "Rematore",
							series: 3,
							range: [8, 10],
							RPE: "9",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {}
						},
					],
				},
			]
		},
		{
			name: "Scheda di Mario",
			session: [
				{
					name: "PULL",
					exercises: [
						{
							configurationType: 'advanced',
							name: "Panca piana",
							series: 2,
							range: [],
							RPE: "8",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {
								sets: [
									{
										min: 6,
										max: 8
									}
								]
							}
						},
						{
							configurationType: 'advanced',
							name: "Curl DB",
							series: 4,
							range: [],
							RPE: "9",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {
								sets: [
									{
										min: 6,
										max: 8
									}
								]
							}
						},
						{
							configurationType: 'basic',
							name: "Alzate laterali",
							series: 4,
							range: [8, 10],
							RPE: "9",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {}
						},
					],
				},
				{
					name: "PUSH",
					exercises: [
						{
							configurationType: 'basic',
							name: "LAT Machine",
							series: 3,
							range: [10, 12],
							RPE: "8",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {}
						},
						{
							configurationType: 'advanced',
							name: "Curl DB",
							series: 4,
							range: [],
							RPE: "9",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {
								sets: [
									{
										min: 6,
										max: 8
									}
								]
							}
						},
						{
							configurationType: 'basic',
							name: "Rematore",
							series: 3,
							range: [8, 10],
							RPE: "9",
							rest: {
								minutes: 2,
								seconds: 30
							},
							note: "Bella!",
							advanced: {}
						},
					],
				},
			]
		},
	]

	public loading: boolean;

	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private router: Router
	) {}

	async ngOnInit() {
		this.loading = true;

		try {
			let uid: string = JSON.parse(localStorage.getItem("profile"))[
				"uid"
			];
			localStorage.removeItem("profile");

			/* this.trainingPrograms =
				await this.firebase.getTrainingProgramsFromUser(uid);
			this.username = await this.firebase.getUsername(uid); */

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

	onCancel() {
		this.router.navigate(["/home/friends"]);
	}

/* 	closeAllCollapse(index: number, type: string) {
		if (type === 'programs') {
			const collapsers: NodeListOf<Element> = document.querySelectorAll('.collapser');
			const collapses: NodeListOf<Element> = document.querySelectorAll('.collapse-body');

			for (let i = 0; i < collapsers.length; i++) {
				if (i !== index) {
					collapsers[i].classList.remove('collapsed');
					collapsers[i].setAttribute('aria-expanded', 'false');
					collapses[i].classList.remove('show');
				}
			}
		}

		else {
			const collapsers: NodeListOf<Element> = document.querySelectorAll('.sessions-collapser');
			const collapses: NodeListOf<Element> = document.querySelectorAll('.sessions-collapse-body');

			for (let i = 0; i < collapsers.length; i++) {
				if (i !== index) {
					collapsers[i].classList.remove('collapsed');
					collapsers[i].setAttribute('aria-expanded', 'false');
					collapses[i].classList.remove('show');
				}
			}
		}

	} */

	saveWorkout(trainingProgramIndex: number) {
		this.firebase.addTrainingProgram(
			this.trainingPrograms[trainingProgramIndex]
		);
		this.snackBar.open("Scheda salvata!", "Ok", { duration: 3000 });
	}

	showNotes(
		programIndex: number,
		workoutIndex: number,
		exerciseIndex: number
	) {
		this.dialog.open(NotesDialogComponent, {
			width: "300px",
			data: {
				notes: this.trainingPrograms[programIndex].session[workoutIndex]
					.exercises[exerciseIndex].note,
			},
		});
	}
}
