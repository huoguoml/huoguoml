# Contributing to HuoguoML

Contributions are always welcome, no matter how large or small. Before contributing,
please read the [code of conduct](CODE_OF_CONDUCT.md).

Some thoughts to help you contribute to this project

## Recommended Communication Style

1. Always leave screenshots for visuals changes
2. Always leave a detailed description in the Pull Request. Leave nothing ambiguous for the reviewer.
3. Always review your code first. Do this by leaving comments in your coding noting questions, or interesting things for the reviewer.
4. Always communicate. Whether it is in the issue or the pull request, keeping the lines of communication helps everyone around you.

## Pull Requests

### We actively welcome your pull requests, however linking your work to an existing issue is preferred._

1. Fork the repo and create your branch from `main`.
1. Name your branch something that is descriptive to the work you are doing. i.e. adds-new-thing or fixes-mobile
1. If you've added code that should be tested, add tests.
1. If you've changed APIs, update the documentation.
1. If you make visual changes, screenshots are required.
1. Ensure the test suite passes.
1. Make sure you address any lint warnings.
1. If you make the existing code better, please let us know in your PR description.
1. A PR description and title are required. The title is required to begin with: "feat:" or "fix:"
1. [Link to an issue](https://help.github.com/en/github/writing-on-github/autolinked-references-and-urls) in the project. Unsolicited code is welcomed, but an issue is required for announce your intentions. PR's without a linked issue will be marked invalid and closed.

*Note for maintainers: All pull requests need a label to assist automation. See the [template](https://github.com/open-sauced/open-sauced/blob/HEAD/.github/release-drafter.yml) to guide which labels to use.*

### Commit and PR Validation

Type is an important prefix in PR, commit message. For each branch, commit, or PR, we need you to specify the type to help us keep things organized. For example,

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

- build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- test: Adding missing tests or correcting existing tests
- chore: updating grunt tasks etc; no production code change

Note that since PR titles only have a single line, you have to use the ! syntax for breaking changes.

See [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for more examples.


### Work in progress

GitHub has support for draft pull requests, which will disable the merge button until the PR is marked as ready for merge.

## Issues

If you plan to contribute a change based on an open issue, please assign yourself by commenting on the following word `.take`. Issues that are not assigned are assumed open, and to avoid conflicts, please assign yourself before beginning work on any issues.

If you would like to contribute to the project for the first time, please consider joining checking the bug or good first issue labels. 

Also, all questions are welcomed.


## Coding Tips

- Ask questions if you are stuck. 
- Try to follow the [Google styleguide](https://google.github.io/styleguide/pyguide.html).

## License

By contributing to the HuoguoML project, you agree that your contributions will be licensed
under its [Apache 2.0](LICENSE).
