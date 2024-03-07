import { getInput, setFailed } from "@actions/core";
import { exec } from "@actions/exec";
import { graphql } from "@octokit/graphql";

async function run() {
  try {
    // Fetch authenticated user info using GraphQL API.
    const token = getInput("token");
    let {
      viewer: { login, name, email, databaseId },
    } = await graphql({
      query: `{ viewer { login name email databaseId } }`,
      headers: { authorization: `bearer ${token}` },
    });

    // Fallback to "ID+USERNAME@users.noreply.github.com".
    name ||= login;
    email ||= `${databaseId}+${login}@users.noreply.github.com`;

    // Set name and email using "git config".
    await exec("git", ["config", "--global", "user.name", name]);
    await exec("git", ["config", "--global", "user.email", email]);
  } catch (error) {
    setFailed(error.message);
  }
}

run();
