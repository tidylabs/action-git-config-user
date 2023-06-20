# Configure git user

This action configures the git user (name and email) by using a personal access
token (PAT) to query the GraphQL API for the authenticated user.

## Usage

```yaml
- uses: tidylabs/action-git-config-user@main
  with:
    # Personal access token (PAT) used to query for the authenticated user.
    # Default: ${{ github.token }}
    token: ""
```

## Contributing

This Node.js-based action requires `node@16` for development. After cloning the
repository run `npm install` to download all the required dependencies.

This action uses [vercel/ncc](https://github.com/vercel/ncc) to bundle
dependencies automatically when a new release is created.
