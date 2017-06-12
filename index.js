import setupApp from './src';
const port = 3003;

setupApp()
	.then(app => app.listen(port, () => console.log(`app runing on port ${port}`)))
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
