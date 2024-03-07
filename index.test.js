import { beforeEach, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule("@actions/core", () => ({
  getInput: jest.fn(),
  setFailed: jest.fn(),
}));
jest.unstable_mockModule("@actions/exec", () => ({
  exec: jest.fn(),
}));
jest.unstable_mockModule("@octokit/graphql", () => ({
  graphql: jest.fn(),
}));

const { getInput, setFailed } = await import("@actions/core");
const { exec } = await import("@actions/exec");
const { graphql } = await import("@octokit/graphql");

async function runAction() {
  await jest.isolateModulesAsync(async () => {
    await import("./index");
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

it('reads authorization "token" from input', async () => {
  await runAction();

  expect(getInput).toHaveBeenCalledTimes(1);
  expect(getInput).toHaveBeenCalledWith("token");
});

it('queries GitHub GraphQL with authorization "token"', async () => {
  getInput.mockReturnValue("TEST_TOKEN");
  await runAction();

  expect(graphql).toHaveBeenCalledTimes(1);
  expect(graphql).toHaveBeenCalledWith({
    query: "{ viewer { login name email databaseId } }",
    headers: { authorization: "bearer TEST_TOKEN" },
  });
});

it("uses <name> by default", async () => {
  graphql.mockReturnValue({
    viewer: {
      login: "test_login",
      name: "TEST NAME",
    },
  });
  await runAction();

  expect(exec).toHaveBeenCalledTimes(2);
  expect(exec).toHaveBeenNthCalledWith(1, "git", [
    "config",
    "--global",
    "user.name",
    "TEST NAME",
  ]);
});

it("uses <login> when <name> is undefined", async () => {
  graphql.mockReturnValue({
    viewer: {
      login: "test_login",
    },
  });
  await runAction();

  expect(exec).toHaveBeenCalledTimes(2);
  expect(exec).toHaveBeenNthCalledWith(1, "git", [
    "config",
    "--global",
    "user.name",
    "test_login",
  ]);
});

it("uses <email> by default", async () => {
  graphql.mockReturnValue({
    viewer: {
      login: "test_login",
      email: "test_email@invalid.com",
      databaseId: 123456,
    },
  });
  await runAction();

  expect(exec).toHaveBeenCalledTimes(2);
  expect(exec).toHaveBeenNthCalledWith(2, "git", [
    "config",
    "--global",
    "user.email",
    "test_email@invalid.com",
  ]);
});

it("uses <databaseId>+<login>@users.noreply.github.com when <email> is undefined", async () => {
  graphql.mockReturnValue({
    viewer: {
      login: "test_login",
      databaseId: 123456,
    },
  });
  await runAction();

  expect(exec).toHaveBeenCalledTimes(2);
  expect(exec).toHaveBeenNthCalledWith(2, "git", [
    "config",
    "--global",
    "user.email",
    "123456+test_login@users.noreply.github.com",
  ]);
});

it("sets failure message on error", async () => {
  graphql.mockImplementation(() => {
    throw new Error("TEST FAILURE!");
  });
  await runAction();

  expect(setFailed).toHaveBeenCalledTimes(1);
  expect(setFailed).toHaveBeenCalledWith("TEST FAILURE!");
});
