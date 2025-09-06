export const runAIMock = async () => {
  const confidence = Math.floor(Math.random() * 20) + 80; // 80–99
  const isValid = Math.random() > 0.2; // 80% chance valid
  const isTampered = !isValid && Math.random() > 0.5;

  return {
    status: isValid ? "valid" : "invalid",
    confidence,
    isTampered
  };
};
