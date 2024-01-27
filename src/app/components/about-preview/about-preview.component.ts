import { Component } from "@angular/core";
import { UpdateNotesDialogComponent } from "../update-notes-dialog/update-notes-dialog.component";
import { MatDialog } from "@angular/material/dialog";

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

	constructor(private dialog: MatDialog) {}

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

	showUpdateNotesDialog() {
		this.dialog.open(UpdateNotesDialogComponent, {
			disableClose: false,
		});
	}

	backToHome() {
		window.location.href = "/home";
	}
}
