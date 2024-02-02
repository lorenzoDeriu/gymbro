import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-weight-dialog",
	templateUrl: "./weight-dialog.component.html",
	styleUrls: ["./weight-dialog.component.css"],
})
export class WeightDialogComponent implements OnInit {
	public theme: "light" | "dark";
	public weight: number = 0;

	constructor(
		private themeService: ThemeService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<WeightDialogComponent>
	) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		this.weight = this.data.weight;
	}

	public decrementWeight() {
		if (this.weight > 0) {
			this.weight--;
		}
	}

	public incrementWeight() {
		this.weight++;
	}

	public saveWeight() {
		this.dialogRef.close();
	}

	public cancel() {
		this.dialogRef.close();
	}
}
