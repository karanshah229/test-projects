export async function downloadBlob(data: any, name: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });

  const href = URL.createObjectURL(blob);

  const a = Object.assign(document.createElement('a'), {
    href,
    style: 'display:none',
    download: name,
  });

  document.body.append(a);
  a.click();

  URL.revokeObjectURL(href);
  a.remove();
}
