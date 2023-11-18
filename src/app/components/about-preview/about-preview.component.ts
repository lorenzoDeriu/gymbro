import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-about-preview",
	templateUrl: "./about-preview.component.html",
	styleUrls: ["./about-preview.component.css"],
})
export class AboutPreviewComponent {
	installButton: HTMLElement | undefined = document.getElementById(
		"install"
	) as HTMLButtonElement;
	installPrompt: any;

	installButtonMobile: HTMLElement | undefined = document.getElementById(
		"installMobile"
	) as HTMLButtonElement;
	installPromptMobile: any;

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.installButton = document.getElementById(
			"install"
		) as HTMLButtonElement;
		this.installButtonMobile = document.getElementById(
			"installMobile"
		) as HTMLButtonElement;

		window.addEventListener("beforeinstallprompt", event => {
			event.preventDefault();
			this.installPrompt = event;
			this.installButton.removeAttribute("hidden");
			this.installPromptMobile = event;
			this.installButtonMobile.removeAttribute("hidden");
		});
	}

	async installApp(device: "desktop" | "mobile") {
		if (device === "desktop") {
			if (!this.installPrompt) {
				return;
			}

			const result = await this.installPrompt.prompt();
			this.disableInAppInstallPrompt();
			if (result.outcome === "dismissed") window.location.reload();
		} else {
			if (!this.installPromptMobile) {
				return;
			}

			const result = await this.installPromptMobile.prompt();
			this.disableInAppInstallPrompt();
			if (result.outcome === "dismissed") window.location.reload();
		}
	}

	disableInAppInstallPrompt() {
		this.installPrompt = null;
		this.installButton.setAttribute("hidden", "");
		this.installPromptMobile = null;
		this.installButtonMobile.setAttribute("hidden", "");
	}

	backToHome() {
		this.router.navigate(["/home"]);
	}
}
