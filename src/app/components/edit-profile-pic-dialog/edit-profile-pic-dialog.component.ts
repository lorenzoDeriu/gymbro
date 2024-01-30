import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FirebaseService } from "src/app/services/firebase.service";
import { NotificationService } from "src/app/services/notification.service";
import { ThemeService } from "src/app/services/theme.service";
import { environment } from "src/environments/environment";

@Component({
	selector: "app-edit-profile-pic-dialog",
	templateUrl: "./edit-profile-pic-dialog.component.html",
	styleUrls: ["./edit-profile-pic-dialog.component.css"],
})
export class EditProfilePicDialogComponent implements OnInit {
	public theme: "light" | "dark";
	public hiddenProfilePicInput: HTMLInputElement;
	public uploading: boolean = false;

	constructor(
		private http: HttpClient,
		private dialogRef: MatDialogRef<EditProfilePicDialogComponent>,
		private themeService: ThemeService,
		private firebase: FirebaseService,
		private notificationService: NotificationService,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			uid: string;
			profilePic: string;
			updateProfilePic: (profilePic: string) => void;
		}
	) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});
	}

	public editProfilePic() {
		this.hiddenProfilePicInput = document.getElementById(
			"hidden-profile-pic"
		) as HTMLInputElement;
		this.hiddenProfilePicInput.click();
	}

	public async checkForExplicitContent(e: Event) {
		this.uploading = true;

		const files: FileList = (e.target as HTMLInputElement).files;

		if (!files || files.length === 0) {
			return;
		}

		const file: File = files[0];
		const fileSizeByte: number = Math.round(file.size / 1024);

		if (file && fileSizeByte < 8192) {
			let fileUrl = URL.createObjectURL(file);
			const form = new FormData();
			form.append("providers", "microsoft, amazon");
			form.append("file", file);
			form.append("fallback_providers", "");

			const options = {
				url: "https://api.edenai.run/v2/image/explicit_content",
				headers: {
					Authorization: `Bearer ${environment.edenAiConfig.apiKey}`,
				},
				data: form,
			};

			this.http
				.post(options.url, options.data, { headers: options.headers })
				.subscribe({
					next: async (res: any) => {
						if (
							(res.microsoft.nsfw_likelihood_score +
								res.amazon.nsfw_likelihood_score) /
								2 >
							0.99
						) {
							this.closeDialog();

							this.notificationService.showSnackBarNotification(
								"Immagine troppo esplicita",
								"Ok",
								{
									duration: 3000,
									panelClass:  [this.theme == "dark" ? "dark-snackbar" : "light-snackbar"]
								}
							);
						} else {
							this.uploadProfilePic(file, fileUrl);
						}
					},
					error: async err => {
						this.closeDialog();

						this.notificationService.showSnackBarNotification(
							"Si è verificato un errore",
							"Ok",
							{
								duration: 3000,
								panelClass:  ['error-snackbar']
							}
						);
					},
				});
		} else {
			this.notificationService.showSnackBarNotification(
				"Immagine troppo grande",
				"Ok",
				{
					duration: 3000,
					panelClass:  ['warning-snackbar']
				}
			);
		}
	}

	public async uploadProfilePic(file: File, fileUrl: string) {
		this.data.profilePic = fileUrl;
		await this.firebase.uploadProfilePic(file, this.data.uid);
		this.data.updateProfilePic(this.data.profilePic);

		this.closeDialog();
	}

	public async removeProfilePic() {
		this.uploading = true;

		await this.firebase.removeProfilePic(this.data.uid);

		this.data.updateProfilePic("");

		this.closeDialog();
	}

	public closeDialog() {
		this.dialogRef.close();

		setTimeout(() => {
			this.uploading = false;
		}, 1000);
	}
}
