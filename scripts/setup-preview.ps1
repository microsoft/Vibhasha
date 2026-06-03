$env:Path += ";C:\Program Files\GitHub CLI"
$repo = "NickDee96/Vibhasha"
gh api -X PATCH repos/$repo -f default_branch=feature/telemetry --jq '.default_branch'
$val = ((Get-Content .env -Raw) -split "`n" | Where-Object { $_ -match '^VITE_APPINSIGHTS_CONNECTION_STRING=' } | Select-Object -First 1) -replace '^VITE_APPINSIGHTS_CONNECTION_STRING=','' -replace "`r",''
gh secret set VITE_APPINSIGHTS_CONNECTION_STRING --repo $repo --body $val
gh api -X PUT repos/$repo/environments/github-pages | Out-Null
gh api -X POST repos/$repo/pages -f "build_type=workflow" --jq '.html_url' 2>&1
