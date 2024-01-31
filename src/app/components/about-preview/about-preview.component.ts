import { Component } from "@angular/core";
import { UpdateNotesDialogComponent } from "../update-notes-dialog/update-notes-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ThemeService } from "src/app/services/theme.service";

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

	public theme: "light" | "dark";

	constructor(
		private dialog: MatDialog,
		private themeService: ThemeService
	) {}

	ngOnInit(): void {
		this.installButton = document.getElementById(
			"install"
		) as HTMLButtonElement;
		this.installButtonMobile = document.getElementById(
			"installMobile"
		) as HTMLButtonElement;

		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

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

	showUpdateNotesDialog() {
		this.dialog.open(UpdateNotesDialogComponent, {
			disableClose: false,
			panelClass: [
				this.theme === "dark" ? "dark-dialog" : "light-dialog",
			],
		});
	}

	backToHome() {
		window.location.href = "/home";
	}
}
