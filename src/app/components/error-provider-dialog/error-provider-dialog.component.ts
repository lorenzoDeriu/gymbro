import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-error-provider-dialog",
	templateUrl: "./error-provider-dialog.component.html",
	styleUrls: ["./error-provider-dialog.component.css"],
})
export class ErrorProviderDialogComponent implements OnInit {
	public theme: "light" | "dark";

	constructor(public dialogRef: MatDialogRef<ErrorProviderDialogComponent>, private themeService: ThemeService) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
