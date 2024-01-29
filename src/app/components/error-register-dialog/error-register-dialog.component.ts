import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-error-register-dialog",
	templateUrl: "./error-register-dialog.component.html",
	styleUrls: ["./error-register-dialog.component.css"],
})
export class ErrorRegisterDialogComponent implements OnInit {
	public theme: "light" | "dark";

	constructor(public dialogRef: MatDialogRef<ErrorRegisterDialogComponent>, private themeService: ThemeService) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe((theme) => {
			this.theme = theme;
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
