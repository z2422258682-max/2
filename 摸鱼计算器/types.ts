export enum AppTab {
  HOME = 'HOME',
  SETTINGS = 'SETTINGS',
  COACH = 'COACH'
}

export interface UserSettings {
  monthlySalary: number;
  workingDaysPerMonth: number;
  startHour: number; // 0-23
  endHour: number; // 0-23
  currencySymbol: string;
}

export interface WageStats {
  perSecond: number;
  perMinute: number;
  perDay: number;
  earnedToday: number;
  isWorkingHours: boolean;
  progressPercent: number;
}