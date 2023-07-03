import { Component } from "@angular/core";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { FirebaseService } from "./services/firebase.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent {
	title = "GymBro";

	constructor(
		updates: SwUpdate,
		private swPush: SwPush,
		private firebase: FirebaseService
	) {
		updates.available.subscribe(event => {
			updates.activateUpdate().then(() => document.location.reload());
		});
	}
}
