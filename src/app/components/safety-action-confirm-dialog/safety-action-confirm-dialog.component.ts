import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-safety-action-confirm-dialog",
	templateUrl: "./safety-action-confirm-dialog.component.html",
	styleUrls: ["./safety-action-confirm-dialog.component.css"],
})
export class SafetyActionConfirmDialogComponent implements OnInit {
	public theme: "light" | "dark";
	public title: string;
	public message: string;
	public args: any[];
	public confirm: Function;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<SafetyActionConfirmDialogComponent>,
		private themeService: ThemeService
	) {}

	ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		this.title = this.data.title;
		this.message = this.data.message;
		this.args = this.data.args;
		this.confirm = this.data.confirm;
	}

	public confirmAction() {
		this.confirm(...this.args);
		this.dialogRef.close();
	}

	public cancel() {
		this.dialogRef.close();
	}
}
