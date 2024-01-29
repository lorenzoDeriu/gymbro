import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-expand-feedback-dialog",
	templateUrl: "./expand-feedback-dialog.component.html",
	styleUrls: ["./expand-feedback-dialog.component.css"],
})
export class ExpandFeedbackDialogComponent implements OnInit {
	public theme: "light" | "dark";
	public message: string = "";

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		private themeService: ThemeService,
		private dialogRef: MatDialogRef<ExpandFeedbackDialogComponent>
	) {}

	ngOnInit() {
		this.themeService.themeObs.subscribe((theme) => {
			this.theme = theme;
		});
		
		this.message = this.data.message;
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
