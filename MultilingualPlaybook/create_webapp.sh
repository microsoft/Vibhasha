RG=varun-artifacts
PLAN=mkdocs-plan
APP=multilingual-playbook-prototype   # must be globally unique

# Create the web app with a runtime that serves static files out of wwwroot
# site.zip is created by `mkdocs build` and zip it zip -r site.zip site/
az webapp deploy --resource-group $RG \
    --name $APP \
    --src-path site.zip --type zip \
    --track-status