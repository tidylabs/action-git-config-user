const core = require("@actions/core");
const exec = require('@actions/exec');
const { graphql } = require("@octokit/graphql");

async function run() {
  try {
    // Fetch authenticated user info using GraphQL API.
    const token = core.getInput("token");
    let { viewer: { login, name, email, databaseId } } = await graphql({
      query: `{ viewer { login name email databaseId } }`,
      headers: { authorization: `bearer ${token}` },
    });

    // Fallback to "ID+USERNAME@users.noreply.github.com".
    name ||= login;
    email ||= `${databaseId}+${login}@users.noreply.github.com`;

    // Set name and email using "git config".
    await exec.exec(`git config --global user.name ${name}`);
    await exec.exec(`git config --global user.email ${email}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();