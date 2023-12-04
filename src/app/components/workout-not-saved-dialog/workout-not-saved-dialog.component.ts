import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { convertTimediffToTime } from "src/app/utils/utils";

@Component({
	selector: "app-workout-not-saved-dialog",
	templateUrl: "./workout-not-saved-dialog.component.html",
	styleUrls: ["./workout-not-saved-dialog.component.css"],
})
export class WorkoutNotSavedDialogComponent {
	public trainingTime: string;

	constructor(
		public dialogRef: MatDialogRef<WorkoutNotSavedDialogComponent>,
		@Inject(MAT_DIALOG_DATA)
		private data: {
			trainingTime: number;
			confirm: Function;
			cancel: Function;
		}
	) {}

	ngOnInit() {
		this.trainingTime = this.getTimeFromTimestamp(this.data.trainingTime);
	}

	public getTimeFromTimestamp(timestamp: number) {
		const timeFromTimestamp: string = convertTimediffToTime(timestamp);
		const splittedTimeFromTimestamp: string[] =
			timeFromTimestamp.split(":");
		const hours: string = splittedTimeFromTimestamp[0];
		const minutes: string = splittedTimeFromTimestamp[1];
		const seconds: string = splittedTimeFromTimestamp[2];
		const hoursFiltered: string = hours.startsWith("0")
			? hours.split("")[1]
			: hours;
		const minutesFiltered: string = minutes.startsWith("0")
			? minutes.split("")[1]
			: minutes;
		const secondsFiltered: string = seconds.startsWith("0")
			? seconds.split("")[1]
			: seconds;

		if (hoursFiltered === "0") {
			if (minutesFiltered === "0") {
				return secondsFiltered + "s";
			}
			return minutesFiltered + "m " + secondsFiltered + "s";
		}

		return (
			hoursFiltered +
			"h " +
			minutesFiltered +
			"m " +
			secondsFiltered +
			"s"
		);
	}

	public confirmAction() {
		this.data.confirm();
		this.dialogRef.close();
	}

	closeDialog() {
		this.data.cancel();
		this.dialogRef.close();
	}
}
