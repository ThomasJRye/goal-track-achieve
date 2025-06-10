export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days ago`;
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `In ${weeks} week${weeks > 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `In ${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `In ${years} year${years > 1 ? 's' : ''}`;
  }
};

export const isOverdue = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
};

export const getDaysUntilDeadline = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};