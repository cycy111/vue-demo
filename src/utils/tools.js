/*将字符串转换为json*/
export function stringToJson(data) {
  return JSON.parse(data ? data.replace(/([\u4e00-\u9fa5\w]+)/g, '"$1"') : {});
}

export function tirmFilter(data) {
  if (typeof data === 'object') {
    return Object.keys(data).map(key => {
      if (data[key] && typeof data[key] !== 'number') {
        data[key] = data[key].trim();
      }
    });
  } else {
    return console.error('参数必须是一个对象');
  }
}
