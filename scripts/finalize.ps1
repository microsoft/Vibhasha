$env:Path += ";C:\Program Files\GitHub CLI"

$targets = @(
  @{ upstream='microsoft/Paza';          fork='NickDee96/Paza';          envPath='C:\Users\v-nickmwangi\Documents\paza-playbook\.env' },
  @{ upstream='microsoft/AtlasPlaybook'; fork='NickDee96/AtlasPlaybook'; envPath='C:\Users\v-nickmwangi\Documents\atlas-playbook\.env' },
  @{ upstream='microsoft/Vibhasha';      fork='NickDee96/Vibhasha';      envPath='C:\Users\v-nickmwangi\Documents\vibhasha-playbook\.env' }
)

"### Set upstream secrets ###"
foreach ($t in $targets) {
  $val = ((Get-Content $t.envPath -Raw) -split "`n" | Where-Object { $_ -match '^VITE_APPINSIGHTS_CONNECTION_STRING=' } | Select-Object -First 1) -replace '^VITE_APPINSIGHTS_CONNECTION_STRING=','' -replace "`r",''
  "-> $($t.upstream)"
  gh secret set VITE_APPINSIGHTS_CONNECTION_STRING --repo $t.upstream --body $val 2>&1
}

""
"### Delete forks ###"
foreach ($t in $targets) {
  "-> $($t.fork)"
  gh repo delete $t.fork --yes 2>&1
}
