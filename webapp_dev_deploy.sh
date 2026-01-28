RG=varun-artifacts
APP=multilingual-playbook-prototype   # must be globally unique
SLOT=dev


# az login --use-device-code && az-pim list > roles.json && az-pim activate set "work" --config roles.json 
# az account set --subscription "VeLLM-MSRI"
# echo "Logged into Azure and set subscription to VeLLM-MSRI"
# echo "--------------------------------"

# echo "createing dev slot"

# az webapp deployment slot create \
#   --resource-group "$RG" \
#   --name "$APP" \
#   --slot "$SLOT" \
#   --configuration-source "$APP"

npm run sync-docs
npm run sync-index
npm run sync-routes

npm run build

cd dist && zip -r ../site.zip .
echo "Zipped dist/ to site.zip"

cd ..
echo "PWD: $(pwd)"

# wait for user to press a key
read -n 1 -s -r -p "Press any key to continue"

echo "--------------------------------"
echo "Deploying to dev slot..."
az webapp deploy \
  --resource-group "$RG" \
  --name "$APP" \
  --slot dev \
  --src-path site.zip --type zip \
  --track-status