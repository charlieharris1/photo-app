import app from './src/index';

const PORT = 3000;

// Clockwise IP = '10.19.14.40'
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
