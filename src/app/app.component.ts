import { Component, OnInit } from "@angular/core";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter } from "rxjs";
import { NotificationService } from "./services/notification.service";
import { ThemeService } from "./services/theme.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
	private theme: "light" | "dark";

	constructor(
		swUpdate: SwUpdate,
		private notification: NotificationService,
		private themeService: ThemeService
	) {
		swUpdate.versionUpdates
			.pipe(
				filter(
					(evt): evt is VersionReadyEvent =>
						evt.type === "VERSION_READY"
				)
			)
			.subscribe(() => {
				this.notification.sendUpdateNotification();
				document.location.reload();
			});
	}

	public ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		if (
			"Notification" in window &&
			Notification.permission !== "granted" &&
			!!!localStorage.getItem("pushNotificationsRequest")
		) {
			localStorage.setItem("pushNotificationsRequest", "true");

			this.notification.showSnackBarNotification(
				"Attiva le notifiche push per una migliore esperienza! Potrai attivarle in un secondo momento dalla pagina del profilo",
				"OK",
				{
					duration: 15000,
					panelClass: [
						this.theme == "dark"
							? "dark-snackbar"
							: "light-snackbar",
					],
				},
				true
			);
		}

		if (localStorage.getItem("theme")) {
			if (localStorage.getItem("theme") === "light") {
				document.body.setAttribute("data-bs-theme", "light");
				document.head.querySelector("meta[name=theme-color]").setAttribute("content", "#fff");
			} else {
				document.body.setAttribute("data-bs-theme", "dark");
				document.head.querySelector("meta[name=theme-color]").setAttribute("content", "#2b3035");
			}
		}

		localStorage.getItem("theme")
			? localStorage.getItem("theme") == "light"
				? document.body.setAttribute("data-bs-theme", "light")
				: document.body.setAttribute("data-bs-theme", "dark")
			: document.body.setAttribute("data-bs-theme", "light");
	}
}
