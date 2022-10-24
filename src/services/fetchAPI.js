const fetchAPI = async (endpoint, type) => {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data[type];
  } catch (error) {
    console.log('Erro');
  }
};

export default fetchAPI;
