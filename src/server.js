const app = require('./app');
const env = require('./utils/venv');

const port = env.PORT;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
