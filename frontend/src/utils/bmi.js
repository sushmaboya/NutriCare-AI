export const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  const heightMeters = height / 100;
  return parseFloat((weight / (heightMeters * heightMeters)).toFixed(2));
};
