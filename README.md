# Configure git user

This action configures the git user (name and email) by using a personal access
token (PAT) to query the GraphQL API for the authenticated user.

## Usage

```yaml
- uses: tidylabs/action-git-config-user@v1
  with:
    # Personal access token (PAT) used to query for the authenticated user.
    # Default: ${{ github.token }}
    token: ""
```

## Contributing

This Node.js-based action requires `node@20` for development. After cloning the
repository run `npm install` to download all the required dependencies.

This action uses [vercel/ncc](https://github.com/vercel/ncc) to bundle
dependencies automatically when a new release is created.

### Updating dependencies

Updates to dependencies are handled automatically by Dependabot. However updates
can also be performed manually using:

```
npx npm-check-updates -u
npm update
```

### Tests

Testing is performed using the [Jest](https://jestjs.io) testing framework. The
tests can be run using `npm test`. All changes should maintain 100% code
coverage by including tests for any added lines of code.
