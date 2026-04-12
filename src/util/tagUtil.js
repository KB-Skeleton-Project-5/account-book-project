export const DEFAULT_TAG_MAP = {
  all: '전체',
  eat: '식비',
  traffic: '교통',
  shopping: '쇼핑',
  medical: '의료',
  salary: '급여',
  finance: '금융',
  sideJob: '부수입',
};

export const getTagTitle = (tagId, dbTags = []) => {
  if (tagId === 'all') return '전체';

  if (dbTags && dbTags.length > 0) {
    const foundTag = dbTags.find((t) => t.tagid === tagId);
    if (foundTag) return foundTag.tagtitle;
  }

  const extractedTitle = tagId.includes('_') ? tagId.split('_')[0] : tagId;

  return DEFAULT_TAG_MAP[tagId] || extractedTitle;
};

export const getTagIconUrl = (tagId) => {
  const iconFileName = DEFAULT_TAG_MAP[tagId] || '전체';
  return new URL(`../assets/icons/${iconFileName}.png`, import.meta.url).href;
};
