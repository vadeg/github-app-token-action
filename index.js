const jwt = require('jsonwebtoken');
const github = require('@actions/github');
const core = require('@actions/core');

function getJwtToken(privateKey, applicationId) {
    return jwt.sign({ iss: applicationId }, privateKey, { algorithm: 'RS256', expiresIn: '10m' });
}

async function exec() {
    const privateKey = core.getInput('app_private_key');
    const applicationId = parseInt(core.getInput('application_id'));

    const jwtToken = getJwtToken(privateKey, applicationId);

    const octokit = github.getOctokit(jwtToken)
    const installations = await octokit.apps.listInstallations();
    const installationId = installations.data[0]['id'];

    const tokenData = await octokit.apps.createInstallationAccessToken({ installation_id: installationId });

    const ghToken = tokenData['data']['token'];
    core.setOutput('gh_access_token', ghToken);
}

exec();


