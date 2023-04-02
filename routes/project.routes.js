const express = require("express");
const router = express.Router();
const { hasPermission, hasProjectAccess, attachProjectData } = require("@middlewares/authorization.middleware");
const { fetchProjectListForUser, createNewProject, fetchProjectDetails, updateProjectDetails, deleteProject, fetchProjectMembers, addMemberToProject, removeMemberFromProject, updateProjectMemberDetails } = require("@controllers/project.controller");

router.route(`/`).get(fetchProjectListForUser);
router.route(`/`).post(createNewProject);
router.route(`/:project_id`).get(attachProjectData, hasProjectAccess, fetchProjectDetails);
router.route(`/:project_id`).patch(attachProjectData, hasProjectAccess, hasPermission(["ADMIN", "OWNER"]), updateProjectDetails);
router.route(`/:project_id`).delete(deleteProject);

module.exports = router;
