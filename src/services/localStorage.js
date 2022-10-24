export const setLocalStorage = (key, info) => {
  localStorage.setItem(key, JSON.stringify(info));
};

export const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key));
