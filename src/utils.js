export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const renderOptions = (arr) => {
  let results = [];
  if (arr) {
    results = arr?.map((opt) => {
      return {
        value: opt,
        label: opt,
      };
    });
  }
  results.push({
    label: "Thêm type",
    value: "add_type",
  });
  return results;
};

export const convertPrice = (price) => {
  try {
      const result  = price?.toLocaleString()
      return `${result} VND`
  } catch (error) {
      return null
  }
}

export const isNumeric = (str) => {
  return !isNaN(str) && !isNaN(parseFloat(str)) 
}

export const formatDateTime = (datetime) => {
  const date = new Date(datetime);
  const year = date.getFullYear();
  let month = date.getMonth()+1;
  let dt = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  

  const datetimeformated = hours + ":" + minutes + ":" + seconds +  " " + dt + "/" + month + "/" + year
  return datetimeformated;  
}