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
		setInterval(() => {
			swUpdate.versionUpdates
				.pipe(
					filter(
						(evt): evt is VersionReadyEvent =>
							evt.type === "VERSION_READY"
					)
				)
				.subscribe(evt => {
					snackbar
						.open(
							"Nuova versione disponibile per GymBro.",
							"Aggiorna",
							{
								duration: 5000,
							}
						)
						.afterDismissed()
						.subscribe(() => {
							document.location.reload();
						});
				});
		}, 60000);
		// swUpdate.versionUpdates
		// 	.pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
		// 	.subscribe(evt => {
		// 		snackbar.open(
		// 			"Nuova versione disponibile per GymBro.", "Aggiorna", {
		// 				duration: 5000
		// 			}
		// 		).afterDismissed().subscribe(() => {
		// 			document.location.reload();
		// 		})
		// 	});
	}
}
