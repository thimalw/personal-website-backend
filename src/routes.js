const router = require('express').Router();
const passport = require('passport');
const jwtAuth = require("./services/jwtAuth");
const UserController = require('./controllers/UserController');
const ProjectsController = require('./controllers/ProjectsController');

passport.use(jwtAuth);

// user routes
router.post('/user', async (req, res) => {
    const user = await UserController.create(req.body);
    res.status(user.status || 500).send(user);
});

router.post('/user/login', async (req, res) => {
    const token = await UserController.authenticate(req.body);
    res.status(token.status || 500).send(token);
});

// project routes
router.post('/projects', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const projects = await ProjectsController.create(req.body);
    res.status(projects.status).send(projects);
});

router.get('/projects', async (req, res) => {
    const projects = await ProjectsController.list();
    res.status(projects.status).send(projects);
});

module.exports = router;
