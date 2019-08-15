const Joi = require('joi');
const Project = require('../models/Project');
const validProject = require('../models/validation/Project');
const logger = require('../services/logger');
const { makeRes, to } = require('../helpers');

const create = async (project) => {
    const validatedProject = Joi.validate(project, validProject, {
        allowUnknown: false,
        abortEarly: false
    });

    if (validatedProject.error !== null) {
        return makeRes(400, 'Unable to create project.', { errors: validatedProject.error.details });
    }

    let err, savedProject;
    const projectInstance = new Project(validatedProject.value);
    [err, savedProject] = await to(projectInstance.save());

    if (err) {
        logger.error(err);
        return makeRes(err.status || 500, 'Unable to create project.');
    }

    return makeRes(200, 'Project created.', { project: savedProject });
};

const list = async () => {
    let err, projects;
    [err, projects] = await to(Project.find({}, '_id title description image createdAt'));

    if (err) {
        logger.error(err);
        return makeRes(err.status, 'Unable to retrieve projects');
    }

    if (!projects) {
        projects = [];
    }

    return makeRes(200, 'Projects retrieved', { projects });
};

module.exports = {
    create,
    list
};
