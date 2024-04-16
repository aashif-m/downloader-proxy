import { Hono } from 'hono'

const app = new Hono();

app.get('/', (c) => {
  return c.text(`
    Welcome to my downloader proxy :)
    to download a file, use the /download/ endpoint with the file url
    Example: /download/https://example.com/file.zip
  `)
})

app.get('/download/*', async (c) => {
  // remove the the /download/ part of the path
  const url = c.req.path.replace('/download/', '');
  console.log('Downloading file from:', url);
  const filename = url.split('/').pop();
  

  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();

    c.header('Content-Disposition', `attachment; filename="${filename}"`);
    return c.body(buffer);
  } catch (err) {
    console.error(err);
    c.status(500);
    return c.text('Error downloading file');
  }
});

export default app
