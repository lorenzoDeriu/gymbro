import { Component, OnInit } from "@angular/core";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter } from "rxjs";
import { NotificationService } from "./services/notification.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
	title = "GymBro";

	constructor(swUpdate: SwUpdate, private notification: NotificationService) {
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
		this.notification.requestPushNotificationsPermissions();

		localStorage.getItem("theme")
			? localStorage.getItem("theme") == "light"
				? document.body.setAttribute("data-bs-theme", "light")
				: document.body.setAttribute("data-bs-theme", "dark")
			: document.body.setAttribute("data-bs-theme", "light");
	}
}
