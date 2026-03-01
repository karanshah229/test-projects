import { HRWUserDetailsType, UserDetailsType } from 'src/types/api/User';

export const skillUpUserDataFixture: UserDetailsType = {
  data: {
    id: 547,
    attributes: {
      name: 'SkillUp Admin',
      first_name: 'SkillUp',
      last_name: 'Admin',
      email: 'skillup+demo1@hackerrank.com',
      job_role: null,
      designation: 'L & D Manager',
      role: 'admin',
      badges_count: 0,
      certifications_count: 0,
      hrw_accessible: false,
      profile_enabled: true,
      employee_skills: [],
      onboarding_status: null,
    },
  },
};

export const HRWUserDataFixture: HRWUserDetailsType = {
  id: '291124',
  email: 'skillup+demo1@hackerrank.com',
  firstname: 'Skillup',
  lastname: 'Demo 1',
  status: 'active',
  role: 'recruiter',
  country: 'India',
  phone: '8989923577',
  timezone: 'Asia/Kolkata',
  tests_permission: 3,
  questions_permission: 3,
  interviews_permission: 3,
  candidates_permission: 3,
  shared_tests_permission: 2,
  shared_questions_permission: 2,
  shared_interviews_permission: 2,
  shared_candidates_permission: 2,
  created_at: '2023-03-18T17:12:14+0000',
  company_admin: true,
  team_admin: true,
  teams: ['122484'],
  activated: true,
  last_activity_time: '2023-09-29T07:03:36+0000',
  applications_enabled: ['hackerrank-for-work', 'skillup', 'engage'],
};
