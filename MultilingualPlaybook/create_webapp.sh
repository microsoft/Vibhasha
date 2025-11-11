echo "Building MkDocs site..."
mkdocs build
echo "Built site to the site/ directory"

echo "--------------------------------"

echo "Zipping site/ directory..."
cd site
zip -r ../site.zip .
cd ..
echo "Zipped site/ to site.zip"
echo "PWD: $(pwd)"

echo "--------------------------------"

az login --use-device-code && az-pim list > roles.json && az-pim activate set "work" --config roles.json 
az account set --subscription "VeLLM-MSRI"
echo "Logged into Azure and set subscription to VeLLM-MSRI"
echo "--------------------------------"

echo "Deploying to Azure Web App..."
RG=varun-artifacts
PLAN=mkdocs-plan
APP=multilingual-playbook-prototype   # must be globally unique

# Create the web app with a runtime that serves static files out of wwwroot
# site.zip is created by `mkdocs build` and zip it zip -r site.zip site/
az webapp deploy --resource-group $RG \
    --name $APP \
    --src-path site.zip --type zip \
    --track-status

echo "--------------------------------"

echo "PWD: $(pwd)"
cd ..
echo "Current Directory: $(pwd)"


echo "git add, commit and push changes"
git add MultilingualPlaybook/docs/*
git add MultilingualPlaybook/site/*
git add MultilingualPlaybook/mkdocs.yml
git add MultilingualPlaybook/create_webapp.sh
git add MultilingualPlaybook/requirements.txt
git add MultilingualPlaybook/site.zip
git commit 
git push

echo "commited and pushed changes to repo"
echo "--------------------------------"