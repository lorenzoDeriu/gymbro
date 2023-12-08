import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter } from "rxjs";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent {
	title = "GymBro";

	constructor(swUpdate: SwUpdate, snackbar: MatSnackBar) {
		swUpdate.versionUpdates
			.pipe(
				filter(
					(evt): evt is VersionReadyEvent =>
						evt.type === "VERSION_READY"
				)
			)
			.subscribe(() => {
				document.location.reload();
			});
	}
}
