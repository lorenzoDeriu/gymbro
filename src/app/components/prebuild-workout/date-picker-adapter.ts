import { NativeDateAdapter } from "@angular/material/core";

export class CustomDateAdapter extends NativeDateAdapter {
	override parse(value: any): Date | null {
	  if (typeof value === 'string' && value.indexOf('/') > -1) {
		const str = value.split('/');

		const year = Number(str[2]);
		const month = Number(str[1]) - 1;
		const date = Number(str[0]);

		return new Date(year, month, date);
	  }
	  const timestamp = typeof value === 'number' ? value : Date.parse(value);
	  return isNaN(timestamp) ? null : new Date(timestamp);
	}

	override getFirstDayOfWeek(): number {
	  return 1;
	}
}
