# Scheduled Release

This example demonstrates how a release schedule can be limited to only occur if there have been no other releases in the past week.

```yaml
name: Scheduled Release

on:
  schedule:
    - cron:  '0 0 * * 1' # Every Monday at 00:00 AM UTC on the default branch

jobs:
  analyze-tags:
    runs-on: ubuntu-latest
    outputs:
      previous-tag: ${{ steps.previoustag.outputs.tag }}
      timestamp-diff: ${{ steps.diff.outputs.timestamp-diff }}
    steps:
      - uses: actions/checkout@v2.3.3
        with:
          fetch-depth: 0
      #▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼#
      - name: Get previous tag
        id: previoustag
        uses: "WyriHaximus/github-action-get-previous-tag@v1"
      #▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲#
      - name: Get seconds from previous tag to now
        id: diff
        shell: bash
        env:
          TIMESTAMP_TAG: ${{ steps.previoustag.outputs.timestamp }}
        run: |
          echo "::set-output name=timestamp-diff::$(expr $(printf '%(%s)T') - $TIMESTAMP_TAG)"

  schedule-release:
    runs-on: ubuntu-latest
    needs: analyze-tags
    if: needs.analyze-tags.outputs.timestamp-diff > 604800 # 604800 equal one week.
    steps:
      - uses: actions/checkout@v2.3.3
        with:
          token: ${{ secrets.GH_TOKEN }}
      - name: Get next minor version
        id: semvers
        uses: "WyriHaximus/github-action-next-semvers@v1"
        with:
          version: ${{ needs.analyze-tags.outputs.previous-tag }}

      # Now schedule the release...

      # In the example below, a file is changed
      # (the scheduled tag is written to an arbitrary property within a package.json file).
      # The following commit would then trigger a semantic release through a following workflow
      # (https://github.com/semantic-release/semantic-release)

      - name: manifest Version
        uses: deef0000dragon1/json-edit-action/@v1
        env:
          KEY: scheduleVersion
          VALUE: ${{ steps.semvers.outputs.patch }}
          FILE: package.json
      - uses: stefanzweifel/git-auto-commit-action@v4.5.1
        with:
          commit_message: 'fix(release): schedule release'
```