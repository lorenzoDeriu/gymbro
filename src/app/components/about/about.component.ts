import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.css"],
})
export class AboutComponent {
	installButton: HTMLElement | undefined = (document.getElementById("install") as HTMLButtonElement);
	installPrompt: any;

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.installButton = (document.getElementById("install") as HTMLButtonElement);

		window.addEventListener("beforeinstallprompt", (event) => {
			event.preventDefault();
			this.installPrompt = event;
			this.installButton.removeAttribute("hidden");
		});
	}

	async installApp() {
		if (!this.installPrompt) {
			return;
		}
		const result = await this.installPrompt.prompt();
		console.log(`Install prompt was: ${result.outcome}`);
		this.disableInAppInstallPrompt();
	}

	disableInAppInstallPrompt() {
		this.installPrompt = null;
		this.installButton.setAttribute("hidden", "");
	}

	backToHome() {
		this.router.navigate(["/home"]);
	}
}
