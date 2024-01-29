import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-deload-dialog",
	templateUrl: "./deload-dialog.component.html",
	styleUrls: ["./deload-dialog.component.css"],
})
export class DeloadDialogComponent implements OnInit {
	public theme: "light" | "dark";

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { confirm: Function },
		public dialogRef: MatDialogRef<DeloadDialogComponent>,
		private themeService: ThemeService
	) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe((theme) => {
			this.theme = theme;
		});
	}

	public activateDeload() {
		this.data.confirm();
		this.dialogRef.close();
	}

	public closeDialog() {
		this.dialogRef.close();
	}
}
