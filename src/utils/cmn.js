export function pagination(pageNo, pageSize, array) {
  var offset = (pageNo - 1) * pageSize;
  return offset + pageSize >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + pageSize);
}

export function tableToExcel(jsonData, cols, fields) {
  //列标题，逗号隔开，每一个逗号就是隔开一个单元格
  let str = `${cols}\n`;
  //增加\t为了不让表格显示科学计数法或者其他格式
  for (let i = 0; i < jsonData.length; i++) {
    if (fields) {
      for (let item of fields.split(',')) {
        let s = jsonData[i][item];

        if (s == 'null' || s == 'NULL') {
          s = '';
        }
        if (s || s == 0) {
          s = s.toString().trim();
          s = s.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
          s = s.replace(/,/g, '，');
        } else {
          s = '';
        }
        str += `${s},`;
      }
    } else {
      for (let item in jsonData[i]) {
        //排除主键
        if (item == 'cid') {
          continue;
        }
        let s = jsonData[i][item];

        if (s == 'null' || s == 'NULL') {
          s = '';
        }
        if (s) {
          s = s.toString().trim();
          s = s.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
          s = s.replace(/,/g, '，');
        } else {
          s = '';
        }

        str += `${'"' + s + '"'},`;
      }
    }

    str += '\n';
  }
  //encodeURIComponent解决中文乱码
  //let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
  //通过创建a标签实现
  let link = document.createElement('a');
  var blob = new Blob(['\ufeff' + str], { type: 'text/csv' }); //解决大文件下载失败
  link.setAttribute('href', URL.createObjectURL(blob));
  //对下载的文件命名

  link.download = `${Date.parse(new Date())}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
