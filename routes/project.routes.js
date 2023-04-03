const express = require("express");
const router = express.Router();
const { hasPermission, hasProjectAccess, attachProjectData } = require("@middlewares/authorization.middleware");
const { fetchProjectListForUser, createNewProject, fetchProjectDetails, updateProjectDetails, deleteProject, fetchProjectMembers, addMemberToProject, removeMemberFromProject, updateProjectMemberDetails } = require("@controllers/project.controller");

router.route(`/`).get(fetchProjectListForUser);
router.route(`/`).post(createNewProject);
router.route(`/:project_id`).get(attachProjectData, hasProjectAccess, fetchProjectDetails);
router.route(`/:project_id`).patch(attachProjectData, hasProjectAccess, hasPermission(["ADMIN", "OWNER"]), updateProjectDetails);
router.route(`/:project_id`).delete(attachProjectData, hasProjectAccess, hasPermission(["OWNER"]), deleteProject);
router.route(`/:project_id/members`).get(attachProjectData, hasProjectAccess, fetchProjectMembers);
router.route(`/:project_id/members`).post(attachProjectData, hasProjectAccess, hasPermission(["ADMIN", "OWNER"]), addMemberToProject);
router.route(`/:project_id/members/:user_id`).delete(attachProjectData, hasProjectAccess, hasPermission(["ADMIN", "OWNER"]), removeMemberFromProject);
router.route(`/:project_id/members/:user_id`).patch(attachProjectData, hasProjectAccess, hasPermission(["ADMIN", "OWNER"]), updateProjectMemberDetails);

module.exports = router;
