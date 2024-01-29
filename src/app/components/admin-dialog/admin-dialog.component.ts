import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-admin-dialog",
	templateUrl: "./admin-dialog.component.html",
	styleUrls: ["./admin-dialog.component.css"],
})
export class AdminDialogComponent implements OnInit {
	public theme: "light" | "dark";

	constructor(public dialogRef: MatDialogRef<AdminDialogComponent>, private themeService: ThemeService) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
