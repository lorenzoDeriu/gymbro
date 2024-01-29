import { Component, Inject, OnInit } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-snackbar",
	templateUrl: "./snackbar.component.html",
	styleUrls: ["./snackbar.component.css"],
})
export class SnackbarComponent implements OnInit {
	public theme: "light" | "dark";

	constructor(
		@Inject(MAT_SNACK_BAR_DATA)
		public data: { message: string; action: string; duration?: number },
		private themeService: ThemeService
	) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe((theme) => {
			this.theme = theme;
		});
	}
}
