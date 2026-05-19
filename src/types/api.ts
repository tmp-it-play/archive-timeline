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
  status: string;
  code: number;
  message: string;
  data: T;
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
  grade: number | null;
  classNum: number | null;
  number: number | null;
  studentNumber: number | null;
  major: Major | null;
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
  totalPages: number;
  totalElements: number;
  students: Student[];
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
  name: string;
  type: ClubType;
  status: ClubStatus;
  foundedYear: number;
  abolishedYear: number | null;
  leader: ParticipantInfo | null;
  participants: ParticipantInfo[];
}

export interface ClubListResponse {
  totalPages: number;
  totalElements: number;
  clubs: ClubDetail[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startYear: number;
  endYear: number | null;
  status: ProjectStatus;
  club: ClubRef | null;
  participants: ParticipantInfo[];
}

export interface ProjectListResponse {
  totalPages: number;
  totalElements: number;
  projects: Project[];
}

export interface Meal {
  mealId: string;
  schoolCode: string;
  schoolName: string;
  officeCode: string;
  officeName: string;
  mealDate: string;
  mealType: MealType;
  mealMenu: string[];
  mealAllergyInfo: string[];
  mealCalories: string | null;
  originInfo: string | null;
  nutritionInfo: string | null;
  mealServeCount: number | null;
}

export interface MealListResponse {
  meals: Meal[];
}

export interface Schedule {
  scheduleId: string;
  schoolCode: string;
  schoolName: string;
  scheduleDate: string;
  academicYear: string | null;
  eventName: string | null;
  eventContent: string | null;
  targetGrades: number[];
}

export interface ScheduleListResponse {
  schedules: Schedule[];
}

export interface Timetable {
  timetableId: string;
  timetableDate: string;
  academicYear: string;
  semester: string | null;
  grade: number;
  classNum: number;
  period: number;
  subject: string | null;
}

export interface TimetableListResponse {
  timetables: Timetable[];
}
