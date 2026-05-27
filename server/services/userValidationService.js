export function isMissingRequiredData(user) {
  return (
    !user.city ||
    !user.job ||
    !user.status ||
    !user.age ||
    !user.email
  );
}