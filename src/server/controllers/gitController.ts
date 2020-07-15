export { };

import { Request, Response, NextFunction } from "express";

// import helper function to execute shell scripts
const execShellCommand = require("./helpers/shellHelper");
const { spawn } = require('child_process');
const gitController: any = {};
const path = require('path');
const { app } = require('electron');

/**
 * @middleware  Clone Github repositor(y/ies) using an SSH connection
 * @desc    Clones git repository from github. Expects repository info to be in res.locals.
 */
gitController.cloneRepo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("request");

  const homePath = app.getAppPath();

  const { repos, projectName } = res.locals;
  if (process.platform == 'win32') {
    const promises = repos.map(async (currentRepo) => {
      const repoOwner = currentRepo.repoOwner;
      const repoName = currentRepo.repoName;

      const bat = await spawn('cmd.exe', ['/c',`cd ${path.join(homePath, "\\src\\scripts\\windows")}`, `cloneRepo.bat ${repoOwner} ${repoName} ${projectName}`]);

      bat.stdout.on('data', (data) => {
        console.log('successful cloning')
        console.log('DATA',data.toString())
        return next();
      })

      bat.stderr.on('data', (data) => {
        console.error(data.toString());
        return next();
      })

      bat.on('exit', (code) => console.log(`Child exited with code ${code}`));
    });
  } else {
    const { repos, projectName } = res.locals;
    const shellCommand = "./src/scripts/cloneRepo.sh";

    // make an array of promises to clone all selected repos
    const promises = repos.map(async (currentRepo) => {
      const repoOwner = currentRepo.repoOwner;
      const repoName = currentRepo.repoName;

      //shell script clones github repo using SSH connection
      const shellResp = await execShellCommand(shellCommand, [
        repoOwner,
        repoName,
        projectName,
      ]);
      console.log("Finished Cloning Repo");
      return shellResp;
    });

    const shellResp = await Promise.all(promises);
    console.log(shellResp);

    console.log("Finished cloning all repos");

    return next();
  }
};

module.exports = gitController;
