import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter } from "rxjs";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
	title = "GymBro";

	constructor(swUpdate: SwUpdate) {
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

	public ngOnInit() {
		localStorage.getItem("theme")
		? (
			localStorage.getItem("theme") == "light"
			? document.body.setAttribute("data-bs-theme", "light")
			: document.body.setAttribute("data-bs-theme", "dark")
		)
		: document.body.setAttribute("data-bs-theme", "light");
	}
}
