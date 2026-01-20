import baseData from './data.json';
import scienceDetail from './sd.json';
import commerceDetail from './commerce.json';

export const STREAMS = [
  { key: 'science', label: 'Science Students', image: '/assets/science.jpg' },
  { key: 'commerce', label: 'Commerce Students', image: '/assets/commerce.jpg' },
  { key: 'arts', label: 'Arts Students', image: '/assets/arts.gif' },
  { key: 'alternate', label: 'Alternate / No-Degree', image: '/assets/no degree.webp' }
];

const scienceDetailMap = new Map(
  (scienceDetail?.careers || []).map((c) => [c.career_name, c])
);

const commerceDetailMap = new Map(
  (commerceDetail?.commerce_students_careers || []).map((c) => [c.career_name, c])
);

function mergeScienceCareer(career) {
  const detail = scienceDetailMap.get(career.career_name);
  if (!detail) return career;

  // Always prioritize detail data from sd.json - use it if property exists in detail
  const mergedSalary = detail.salary_in_india || detail.salary_range_inr || career.salary_range_inr || {
    entry: '',
    mid: '',
    high: ''
  };

  return {
    ...career,
    // Use detail value if it exists (even if empty string/array), otherwise use career value
    overview: detail.hasOwnProperty('overview') ? detail.overview : career.overview,
    who_should_choose_this: detail.hasOwnProperty('who_should_choose_this') ? detail.who_should_choose_this : career.who_should_choose_this,
    skills_required: detail.hasOwnProperty('skills_required') ? detail.skills_required : career.skills_required,
    learning_paths: detail.hasOwnProperty('learning_paths') ? detail.learning_paths : career.learning_paths,
    career_roadmap: detail.hasOwnProperty('career_roadmap') ? detail.career_roadmap : career.career_roadmap,
    scope_in_india: detail.hasOwnProperty('scope_in_india') ? detail.scope_in_india : career.scope_in_india,
    work_areas: detail.hasOwnProperty('work_areas') ? detail.work_areas : career.work_areas,
    pros_and_cons: detail.hasOwnProperty('pros_and_cons') ? detail.pros_and_cons : career.pros_and_cons,
    how_to_start: detail.hasOwnProperty('how_to_start') ? detail.how_to_start : career.how_to_start,
    resources: detail.hasOwnProperty('resources') ? detail.resources : career.resources,
    related_careers: detail.hasOwnProperty('related_careers') ? detail.related_careers : career.related_careers,
    salary_range_inr: {
      entry_level: mergedSalary.entry || mergedSalary.entry_level || career?.salary_range_inr?.entry_level || '',
      mid_level: mergedSalary.mid || mergedSalary.mid_level || career?.salary_range_inr?.mid_level || '',
      high_level: mergedSalary.high || mergedSalary.high_level || career?.salary_range_inr?.high_level || ''
    }
  };
}

function mergeCommerceCareer(career) {
  const detail = commerceDetailMap.get(career.career_name);
  if (!detail) return career;

  return {
    ...career,
    overview: detail.hasOwnProperty('overview') ? detail.overview : career.overview,
    who_should_choose_this: detail.hasOwnProperty('who_should_choose_this') ? detail.who_should_choose_this : career.who_should_choose_this,
    skills_required: detail.hasOwnProperty('skills_required') ? detail.skills_required : career.skills_required,
    learning_paths: detail.hasOwnProperty('learning_paths') ? detail.learning_paths : career.learning_paths,
    career_roadmap: detail.hasOwnProperty('career_roadmap') ? detail.career_roadmap : career.career_roadmap,
    scope_in_india: detail.hasOwnProperty('scope_in_india') ? detail.scope_in_india : career.scope_in_india,
    work_areas: detail.hasOwnProperty('work_areas') ? detail.work_areas : career.work_areas,
    pros_and_cons: detail.hasOwnProperty('pros_and_cons') ? detail.pros_and_cons : career.pros_and_cons,
    how_to_start: detail.hasOwnProperty('how_to_start') ? detail.how_to_start : career.how_to_start,
    resources: detail.hasOwnProperty('resources') ? detail.resources : career.resources,
    related_careers: detail.hasOwnProperty('related_careers') ? detail.related_careers : career.related_careers,
    salary_range_inr: {
      entry_level: detail?.salary_range_inr?.entry_level || career?.salary_range_inr?.entry_level || '',
      mid_level: detail?.salary_range_inr?.mid_level || career?.salary_range_inr?.mid_level || '',
      high_level: detail?.salary_range_inr?.high_level || career?.salary_range_inr?.high_level || ''
    }
  };
}

export function getStreamCareers(streamKey) {
  const data = baseData?.streams?.[streamKey] ?? [];
  if (streamKey === 'science') {
    return data.map(mergeScienceCareer);
  }
  if (streamKey === 'commerce') {
    return data.map(mergeCommerceCareer);
  }
  return data;
}

export function getCareerById(streamKey, careerId) {
  const careers = getStreamCareers(streamKey);
  return careers.find((c) => c.id === careerId) || null;
}

