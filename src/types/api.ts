import type {
  Major,
  Sex,
  StudentRole,
  ClubType,
  ClubStatus,
  ProjectStatus,
  MealType,
} from './enums.js';

export interface CommonApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface PageInfo {
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

export interface ClubRef {
  id: number;
  clubName: string;
}

export interface Student {
  id: number;
  name: string;
  sex: Sex;
  email: string;
  grade: number;
  classNum: number;
  number: number;
  studentNumber: number;
  major: Major;
  specialty: string | null;
  role: StudentRole;
  dormitoryFloor: number | null;
  dormitoryRoom: number | null;
  majorClub: ClubRef | null;
  autonomousClub: ClubRef | null;
  githubId: string | null;
  githubUrl: string | null;
}

export interface StudentListResponse {
  data: Student[];
  pageInfo: PageInfo;
}

export interface ParticipantInfo {
  id: number;
  name: string;
  email: string;
  studentNumber: number;
  major: Major;
  sex: Sex;
}

export interface ClubDetail {
  id: number;
  clubName: string;
  clubType: ClubType;
  clubStatus: ClubStatus | null;
  foundedYear: number | null;
  abolishedYear: number | null;
  leader: ParticipantInfo | null;
  participants: ParticipantInfo[];
}

export interface ClubListResponse {
  data: ClubDetail[];
  pageInfo: PageInfo;
}

export interface Project {
  id: number;
  projectName: string;
  description: string | null;
  status: ProjectStatus;
  club: ClubRef | null;
  participants: ParticipantInfo[];
}

export interface ProjectListResponse {
  data: Project[];
  pageInfo: PageInfo;
}

export interface MealMenu {
  name: string;
  calorieInfo: string;
}

export interface Meal {
  date: string;
  mealName: string;
  menus: MealMenu[];
  allergyInfo: string;
  mealType: MealType | null;
}

export interface MealListResponse {
  data: Meal[];
}

export interface Schedule {
  date: string;
  eventName: string;
  eventType: string;
  year: number;
}

export interface ScheduleListResponse {
  data: Schedule[];
}

export interface TimetablePeriod {
  period: number;
  subject: string;
  teacher: string | null;
}

export interface Timetable {
  date: string;
  grade: number;
  classNum: number;
  periods: TimetablePeriod[];
}

export interface TimetableListResponse {
  data: Timetable[];
}
