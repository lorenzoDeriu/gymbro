import { Component, Inject } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from "@angular/material/dialog";

@Component({
	selector: "app-share-dialog",
	templateUrl: "./share-dialog.component.html",
	styleUrls: ["./share-dialog.component.css"],
})
export class ShareDialogComponent {
	url: string = "https://gymbro-ld.web.app/home/firends";
	telegramMessage: string = `Ecco il mio username: ${this.data.username}. Copialo e incollalo nella pagina di ricerca degli amici, o segui il link qui sopra!`;

	whatsappMessage: string = `${this.url} Ecco il mio username: ${this.data.username}. Copialo e incollalo nella pagina di ricerca degli amici, o segui il link qui sopra! `;

	constructor(
		public dialogRef: MatDialogRef<ShareDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { username: string }
	) {}

	closeDialog() {
		this.dialogRef.close();
	}
}
