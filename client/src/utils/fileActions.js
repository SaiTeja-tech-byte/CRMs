
export const previewFile = (file) => {
  if (!file || !file.fileUrl) return;
  const win = window.open();
  if (win) {
    win.document.write(
      file.fileUrl.startsWith("data:image")
        ? `<img src="${file.fileUrl}" style="max-width:100%;height:auto;display:block;margin:0 auto;" />`
        : `<iframe src="${file.fileUrl}" style="border:0;width:100%;height:100vh;"></iframe>`
    );
    win.document.title = file.name || "Receipt Preview";
  }
};

// Triggers a real browser download of the file using its original name.
export const downloadFile = (file) => {
  if (!file || !file.fileUrl) return;
  const link = document.createElement("a");
  link.href = file.fileUrl;
  link.download = file.name || "receipt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
