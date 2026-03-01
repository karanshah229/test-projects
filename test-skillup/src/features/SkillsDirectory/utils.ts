import { ProficiencyProgress, SkillsDirectoryData } from 'src/types/api/skills';
import { ProficiencyType } from 'src/types/common';

export function getLatestProficiency(progress: ProficiencyProgress): ProficiencyType | null {
  const latestProficiency = Object.entries(progress).reduce(
    (latest, [proficiency, { latest_activity_at }]) => {
      const activityDate = new Date(latest_activity_at);
      if (activityDate > latest.latestActivity) {
        return { proficiency: proficiency as ProficiencyType, latestActivity: activityDate };
      }
      return latest;
    },
    { proficiency: null, latestActivity: new Date('1970-01-01T00:00:00.000Z') },
  );

  return latestProficiency.proficiency;
}

export function getSortedSkillsByRecency(skills: SkillsDirectoryData[]): SkillsDirectoryData[] {
  return [...skills]
    .reduce((skillsWithProgress, skill) => {
      const latestProficiency = getLatestProficiency(skill.attributes.proficiency_progress);
      if (latestProficiency !== null) {
        skillsWithProgress.push(skill);
      }
      return skillsWithProgress;
    }, [])
    .sort((first: SkillsDirectoryData, second: SkillsDirectoryData) => {
      const latestProficiencyA = getLatestProficiency(first.attributes.proficiency_progress);
      const latestProficiencyB = getLatestProficiency(second.attributes.proficiency_progress);

      if (latestProficiencyA === null && latestProficiencyB !== null) {
        return 1;
      }
      if (latestProficiencyA !== null && latestProficiencyB === null) {
        return -1;
      }

      const latestActivityA = new Date(
        first.attributes.proficiency_progress[latestProficiencyA].latest_activity_at,
      );
      const latestActivityB = new Date(
        second.attributes.proficiency_progress[latestProficiencyB].latest_activity_at,
      );

      return latestActivityB.getTime() - latestActivityA.getTime();
    });
}

export function getPopularSkills(
  skills: SkillsDirectoryData[],
  limit: number = 10,
): SkillsDirectoryData[] {
  return [...skills]
    .sort((a, b) => a.attributes.popularity_index - b.attributes.popularity_index)
    .slice(0, limit);
}
