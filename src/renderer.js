import { ipcRenderer } from "electron";

// イベントを受け取る
ipcRenderer.on("open_file", (event, tabledata) => {
  console.log(tabledata);

  console.log(Object.keys(tabledata[0]));

  let columns = Object.keys(tabledata[0]).map(key => {
    if (key.startsWith("_")) {
      return { title: key, field: key, visible: false };
    } else {
      return { title: key, field: key, visible: true };
    }
  });

  new Tabulator("#example-table", {
    data: tabledata,
    layout: "fitColumns",
    columns: columns
  });
});
