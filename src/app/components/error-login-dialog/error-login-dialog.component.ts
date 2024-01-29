import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-error-login-dialog",
	templateUrl: "./error-login-dialog.component.html",
	styleUrls: ["./error-login-dialog.component.css"],
})
export class ErrorLoginDialogComponent implements OnInit {
	public theme: "light" | "dark";

	constructor(
		public dialogRef: MatDialogRef<ErrorLoginDialogComponent>,
		private themeService: ThemeService
	) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
