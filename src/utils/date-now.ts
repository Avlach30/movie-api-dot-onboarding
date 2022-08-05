export const generateDateNow = () => {
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toISOString().split('T')[1];
  const hour = time.split(':')[0];
  const minute = time.split(':')[1];
  const second = time.split(':')[2].split('.')[0];
  const currentDate = `${date} ${hour}:${minute}:${second}`;

  return currentDate;
};
