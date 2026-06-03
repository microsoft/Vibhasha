param([string]$AppId)
if (-not $AppId) {
  $AppId = ((Get-Content .env -Raw) | Select-String -Pattern 'ApplicationId=([0-9a-f-]+)').Matches.Groups[1].Value
}
"AppId: $AppId"
$tok = (az account get-access-token --resource https://api.applicationinsights.io --query accessToken -o tsv)
function Q($q) {
  $body = @{ query = $q } | ConvertTo-Json
  Invoke-RestMethod -Uri "https://api.applicationinsights.io/v1/apps/$AppId/query" -Method Post -Headers @{ Authorization = "Bearer $tok"; "Content-Type" = "application/json" } -Body $body
}

"=== Totals (last 2h) ==="
$r = Q "union pageViews, customEvents, exceptions, requests | where timestamp > ago(2h) | summarize count() by itemType"
if ($r.tables[0].rows.Count -eq 0) { "(no data)" } else { $r.tables[0].rows | ForEach-Object { "{0,-15} {1}" -f $_[0], $_[1] } }

""
"=== Sessions (last 2h) ==="
$r = Q "union pageViews, customEvents | where timestamp > ago(2h) | summarize sessions=dcount(session_Id), users=dcount(user_Id), events=count()"
$r.tables[0].rows | ForEach-Object { "sessions={0} users={1} events={2}" -f $_[0], $_[1], $_[2] }

""
"=== Recent page views ==="
$r = Q "pageViews | where timestamp > ago(2h) | project timestamp, name, pb=tostring(customDimensions.playbook), ch=tostring(customDimensions.chapter_id) | order by timestamp desc | take 15"
if ($r.tables[0].rows.Count -eq 0) { "(none)" } else { $r.tables[0].rows | ForEach-Object { "{0}  {1,-40} pb={2} ch={3}" -f $_[0], $_[1], $_[2], $_[3] } }

""
"=== Recent custom events ==="
$r = Q "customEvents | where timestamp > ago(2h) | project timestamp, name, pb=tostring(customDimensions.playbook), ch=tostring(customDimensions.chapter_id) | order by timestamp desc | take 15"
if ($r.tables[0].rows.Count -eq 0) { "(none)" } else { $r.tables[0].rows | ForEach-Object { "{0}  {1,-30} pb={2} ch={3}" -f $_[0], $_[1], $_[2], $_[3] } }
