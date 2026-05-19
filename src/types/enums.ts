export type Major = 'SW_DEVELOPMENT' | 'SMART_IOT' | 'AI';

export type Sex = 'MAN' | 'WOMAN';

export type StudentRole =
  | 'GENERAL_STUDENT'
  | 'STUDENT_COUNCIL'
  | 'DORMITORY_MANAGER'
  | 'CLUB_LEADER'
  | 'GRADUATE'
  | 'WITHDRAWN';

export type ClubType = 'MAJOR_CLUB' | 'AUTONOMOUS_CLUB';

export type ClubStatus = 'ACTIVE' | 'ABOLISHED';

export type ProjectStatus = 'ACTIVE' | 'ENDED';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export type SortDirection = 'ASC' | 'DESC';

export type StudentSortBy =
  | 'ID'
  | 'NAME'
  | 'EMAIL'
  | 'STUDENT_NUMBER'
  | 'GRADE'
  | 'CLASS_NUM'
  | 'NUMBER'
  | 'MAJOR'
  | 'ROLE'
  | 'SEX'
  | 'DORMITORY_ROOM';

export type ClubSortBy = 'ID' | 'NAME' | 'TYPE' | 'FOUNDED_YEAR' | 'STATUS';

export type ProjectSortBy = 'ID' | 'NAME';
