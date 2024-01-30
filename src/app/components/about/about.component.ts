import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { UpdateNotesDialogComponent } from "../update-notes-dialog/update-notes-dialog.component";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.css"],
})
export class AboutComponent {
	private installButton: HTMLElement | undefined = document.getElementById(
		"install"
	) as HTMLButtonElement;
	private installPrompt: any;

	private installButtonMobile: HTMLElement | undefined =
		document.getElementById("installMobile") as HTMLButtonElement;
	private installPromptMobile: any;

	public theme: "dark" | "light";

	constructor(
		private router: Router,
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
			panelClass: [this.theme === "dark" ? "dark-dialog" : "light-dialog"]
		});
	}

	backToHome() {
		this.router.navigate(["/home"]);
	}
}
