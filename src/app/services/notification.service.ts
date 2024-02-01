import { Injectable } from "@angular/core";
import { FirebaseService } from "./firebase.service";
import { Notification, NotificationType } from "../Models/Notification.model";
import { v4 as uuidv4 } from "uuid";
import {
	MatSnackBar,
	MatSnackBarConfig,
	MatSnackBarRef,
	TextOnlySnackBar,
} from "@angular/material/snack-bar";
import { ThemeService } from "./theme.service";

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	private notifications: Notification[] = [];
	private usernames: { [key: string]: string } = {};
	private theme: "light" | "dark";

	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar,
		private themeService: ThemeService
	) {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		this.retriveNotification();
	}

	public async retriveNotification() {
		this.firebase
			.getNotification()
			.then(async (notifications: Notification[]) => {
				this.notifications = await this.resolveUsername(notifications);
			});
	}

	private async resolveUsername(notifications: Notification[]) {
		for (let i = 0; i < notifications.length; i++) {
			if (
				notifications[i].from in this.usernames ||
				!notifications[i].from
			) {
				notifications[i].username =
					this.usernames[notifications[i].from];
				continue;
			}

			notifications[i].username = await this.firebase.getUsername(
				notifications[i].from
			);

			this.usernames[notifications[i].from] = notifications[i].username;
		}
		return notifications;
	}

	public getNotifications() {
		return this.notifications;
	}

	// Info Notification
	public async sendNotification(to: string, type: NotificationType) {
		const notification: Notification = {
			id: `ntf-${uuidv4()}`,
			from: await this.firebase.getUid(),
			type: type,
		};

		await this.firebase.addNotification(to, notification);
	}

	public async deleteNotification(id: string) {
		await this.firebase.deleteNotification(id);
		this.retriveNotification();
	}

	public async deleteAllNotifications() {
		await this.firebase.deleteAllNotifications();
		this.retriveNotification();
	}

	public async sendUpdateNotification() {
		await this.firebase.addNotification(await this.firebase.getUid(), {
			id: `ntf-${uuidv4()}`,
			type: "update",
		});
	}

	public async sendFeedbackNotification() {
		await this.firebase.addNotificationToAdmin();
	}

	// SnackBar Notification
	public showSnackBarNotification(
		message: string,
		action: string,
		options?: MatSnackBarConfig,
		permissionRequest?: boolean
	) {
		const defaultOptions: MatSnackBarConfig = {
			duration: 3000,
		};

		if (!options) options = defaultOptions;

		let snackbarRef: MatSnackBarRef<TextOnlySnackBar> = this.snackBar.open(
			message,
			action,
			options
		);

		if (permissionRequest) {
			snackbarRef.onAction().subscribe({
				next: () => {
					this.requestPushNotificationsPermissions();
				},
			});
		}
	}

	public requestPushNotificationsPermissions() {
		if ("Notification" in window && Notification.permission !== "granted") {
			Notification.requestPermission().then((permission: string) => {
				if (permission === "granted") {
					this.showSnackBarNotification(
						"Notifiche push attivate!",
						"OK",
						{
							panelClass: [
								this.theme == "dark"
									? "dark-snackbar"
									: "light-snackbar",
							],
						}
					);

					return true;
				}

				return false;
			});
		}

		return false;
	}

	// Push Notification
	public async sendPushNotification(message: string) {
		if (
			"serviceWorker" in navigator &&
			Notification.permission === "granted"
		) {
			navigator.serviceWorker.ready.then(
				(registration: ServiceWorkerRegistration) => {
					registration.showNotification("GymBro", {
						body: message,
						icon: "assets/rounded-logo.png",
					});
				}
			);
		}
	}
}
