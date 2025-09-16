RG=varun-artifacts
PLAN=mkdocs-plan
APP=multilingual-playbook-prototype   # must be globally unique

# Create the web app with a runtime that serves static files out of wwwroot
az webapp create -g $RG -p $PLAN -n $APP --runtime "PHP:8.2"
# If your CLI expects the old delimiter, use: --runtime "PHP|8.2"
