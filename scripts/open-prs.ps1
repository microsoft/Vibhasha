$env:Path += ";C:\Program Files\GitHub CLI"
$prs = @(
  @{ repo = 'microsoft/Paza';          base = 'develop'; title = 'feat(telemetry): App Insights instrumentation + Pages preview workflow' },
  @{ repo = 'microsoft/AtlasPlaybook'; base = 'changes'; title = 'feat(telemetry): App Insights instrumentation + Pages preview workflow' },
  @{ repo = 'microsoft/Vibhasha';      base = 'main';    title = 'feat(telemetry): App Insights instrumentation + fix Pages basename' }
)
$body = @"
Adds Application Insights browser telemetry to the playbook and updates the GitHub Pages deploy workflow to inject `VITE_APPINSIGHTS_CONNECTION_STRING` from a repository secret at build time. Verified end-to-end against a personal fork preview deployment - pageViews and custom events arrive correctly in App Insights (tagged with playbook + chapter_id).
"@
foreach ($p in $prs) {
  "=== $($p.repo): feature/telemetry -> $($p.base) ==="
  gh pr create --repo $p.repo --base $p.base --head feature/telemetry --title $p.title --body $body 2>&1
  ""
}
